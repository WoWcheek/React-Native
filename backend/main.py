from math import ceil
from enum import Enum
from uuid import uuid4
from typing import List, Tuple, Optional
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy import create_engine, Column, Integer, String, Text, Float
from fastapi import FastAPI, HTTPException, Depends, APIRouter, Query, Request

#region Configuration

DATABASE_URL = "sqlite:///./shop.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

#endregion

#region DB Models

class HandleMaterial(str, Enum):
    wood = "wood"
    plastic = "plastic"
    metal = "metal"
    rubber = "rubber"
    carbon_fiber = "carbon_fiber"

class SteelMaterial(str, Enum):
    stainless_steel = "stainless_steel"
    damascus = "damascus"
    carbon_steel = "carbon_steel"
    titanium = "titanium"
    ceramic = "ceramic"

class KnifeDB(Base):
    __tablename__ = "knives"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    brand = Column(String, nullable=False)
    blade_length = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    handle_material = Column(String, nullable=False)
    steel_type = Column(String, nullable=False)
    images = Column(Text, nullable=False)
    amount = Column(Integer, nullable=False)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    items = Column(Text, nullable=False)
    is_payed = Column(Integer, default=0)

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    token = Column(String, unique=True, nullable=True)
    role = Column(Integer, nullable=False)
    avatar = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)

#endregion

#region Knife Requests and Responses

class KnifeCreateRequest(BaseModel):
    name: str
    amount: Optional[int] = 0
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    brand: str
    blade_length: float = Field(..., gt=0)
    weight: float = Field(..., gt=0)
    handle_material: HandleMaterial
    steel_type: SteelMaterial
    images: List[str] = Field(..., min_items=0, max_items=3)

    # @validator("images", each_item=True)
    # def validate_base64_images(cls, v):
    #     if not isinstance(v, str) or not v.startswith("data:image/"):
    #         raise ValueError("Each image must be a valid base64-encoded string starting with 'data:image/'.")
    #     return v

class KnifeAmountRequest(BaseModel):
    amount: int = Field(..., ge=0)

class KnifeResponse(BaseModel):
    id: int
    name: str
    amount: int
    description: Optional[str]
    price: float
    brand: str
    blade_length: float
    weight: float
    handle_material: str
    steel_type: str
    images: List[str]

    class Config:
        from_attributes = True

class PaginatedKnivesResponse(BaseModel):
    knives: List[KnifeResponse]
    totalCount: int
    totalPages: int
    currentPage: int

#endregion

#region Orders Requests and Responses

class OrderUser(BaseModel):
    avatar: str
    username: str

class OrderResponse(BaseModel):
    id: int
    user: OrderUser
    items: List[Tuple[KnifeResponse, int]]
    is_payed: bool

    class Config:
        from_attributes = True

class SingleAdminOrderResponse(BaseModel):
    id: int
    user: OrderUser
    items: List[Tuple[str, int]]
    is_payed: bool

    class Config:
        from_attributes = True

class AdminOrdersResponse(BaseModel):
    orders: List[SingleAdminOrderResponse]

    class Config:
        from_attributes = True

class CreateOrderRequest(BaseModel):
    user_id: int
    items: List[Tuple[int, int]]
    is_payed: bool = False

class AddToCartRequest(BaseModel):
    user_id: int
    is_payed: bool = False
    items: Tuple[int, int]

#endregion

#region User Requests and Responses

class UserRequest(BaseModel):
    username: str
    password: str
    role: int

class UserResponse(BaseModel):
    id: int
    role: int
    avatar: str
    username: str
    token: Optional[str]

    class Config:
        from_attributes = True

class AvatarRequest(BaseModel):
    token: str
    avatar: str
    username: str

#endregion

#region Middleware

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # if (request.url.path.startswith(("/authorization", "/docs", "/openapi.json"))
    #     or request.url.path.endswith(("/buy"))
    #     or request.method == 'GET'):
    return await call_next(request)
    
    authorization = request.headers.get("Authorization")
    if not authorization:
        return JSONResponse(content={"detail": "Authorization header missing"}, status_code=401)
    
    parts = authorization.split(" ")
    token = parts[1] if len(parts) > 1 else ""

    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.token == token).first()
    if not user:
        return JSONResponse(content={"detail": "Invalid or expired token"}, status_code=401)
    response = await call_next(request)
    db.close()
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#endregion

#region Knives routes

knives_router = APIRouter(prefix="/knives", tags=["Knives"])

@knives_router.get("/", response_model=PaginatedKnivesResponse)
def get_knives(
    pageNumber: int = Query(1, alias="pageNumber", ge=1),
    pageSize: int = Query(12, alias="pageSize", ge=1),
    load_all: bool = Query(False, alias="loadAll"),
    db: Session = Depends(get_db)
):
    total_count = db.query(KnifeDB).count()

    knives = (db.query(KnifeDB)
              .offset((pageNumber - 1) * pageSize)
              .limit(total_count if load_all else pageSize)
              .all()
    )
    
    for k in knives:
        k.images = k.images.split("#,#")
        
    return {
        "knives": knives,
        "totalCount": total_count,
        "totalPages": ceil(total_count / pageSize),
        "currentPage": pageNumber
    }

@knives_router.get("/{knife_id}", response_model=KnifeResponse)
def get_knife(knife_id: int, db: Session = Depends(get_db)):
    knife = (db.query(KnifeDB)
             .filter(KnifeDB.id == knife_id)
             .first()
    )
    if not knife:
        raise HTTPException(status_code=404, detail="Order not found.")
    knife.images = knife.images.split("#,#")
    return knife

@knives_router.post("/", response_model=KnifeResponse)
def create_knife(knife_request: KnifeCreateRequest, db: Session = Depends(get_db)):
    if knife_request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0.")

    cleaned_images = [image.split(':')[1] if image.startswith('image:') else image for image in knife_request.images]
    
    images_str = "#,#".join(cleaned_images)
    new_knife = KnifeDB(**knife_request.dict(exclude={"images"}), images=images_str)
    
    db.add(new_knife)
    db.commit()
    db.refresh(new_knife)
    
    new_knife.images = cleaned_images
    return new_knife

@knives_router.put("/{knife_id}", response_model=KnifeResponse)
def update_knife(knife_id: int, knife_request: KnifeCreateRequest, db: Session = Depends(get_db)):
    knife = db.query(KnifeDB).filter(KnifeDB.id == knife_id).first()
    if not knife:
        raise HTTPException(status_code=404, detail="Knife not found.")
    
    for key, value in knife_request.dict(exclude={"images"}).items():
        if key != "amount":
            setattr(knife, key, value)
    
    cleaned_images = [image.split(':')[1] if image.startswith('image:') else image for image in knife_request.images]
    knife.images = "#,#".join(cleaned_images)
    
    db.commit()
    db.refresh(knife)
    
    knife.images = cleaned_images
    return knife

@knives_router.delete("/{knife_id}")
def delete_knife(knife_id: int, db: Session = Depends(get_db)):
    knife = db.query(KnifeDB).filter(KnifeDB.id == knife_id).first()
    if not knife:
        raise HTTPException(status_code=404, detail="Knife not found.")
    
    db.delete(knife)

    orders = db.query(OrderDB).filter(OrderDB.items.contains(f'{knife_id}:')).all()

    for order in orders:
        pairs = order.items.__str__().split("#,#")
        filtered_items = []

        for pair in pairs:
            id = int(pair.split(":")[0])
            if id != knife_id:
                filtered_items.append(pair)
        
        if len(filtered_items) == 0:
            db.delete(order)
        else:
            new_items_str = "#,#".join(filtered_items) if len(filtered_items) > 0 else ""
            order.items = new_items_str
            db.refresh(order)

    db.commit()
    return {"message": "Knife deleted."}

@knives_router.put("/{knife_id}/amount")
def set_knife_amount(knife_id: int, amountRequest: KnifeAmountRequest, db: Session = Depends(get_db)):
    if amountRequest.amount < 0:
        raise HTTPException(status_code=400, detail="Amount must be greater or equal to 0.")

    knife = db.query(KnifeDB).filter(KnifeDB.id == knife_id).first()
    if not knife:
        raise HTTPException(status_code=404, detail="Knife not found.")
    
    knife.amount = amountRequest.amount
    db.commit()
    return {"knife_id": knife_id, "amount": amountRequest.amount}

app.include_router(knives_router)

#endregion

#region Orders routes

orders_router = APIRouter(prefix="/orders", tags=["Orders"])

@orders_router.get("/", response_model=AdminOrdersResponse)
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(OrderDB).all()
    response = AdminOrdersResponse(orders=[])

    if not orders:
        return response
    
    for order in orders:
        items = []
        for item in order.items.split("#,#"):
            if item:
                knife_id, amount = map(int, item.split(":"))
                knife = db.query(KnifeDB).filter(KnifeDB.id == knife_id).first()
                if knife:
                    knife.images = str(knife.images).split("#,#")
                    items.append((knife.name, amount))

        user = db.query(UserDB).filter(UserDB.id == order.user_id).first()

        if not user:
            continue
        
        response.orders.append({"id": order.id, "user": OrderUser(avatar=user.avatar, username=user.username), "items": items, "is_payed": bool(order.is_payed)})
    
    return response

@orders_router.get("/{user_id}", response_model=OrderResponse)
def get_order(user_id: int, is_payed: int, db: Session = Depends(get_db)):
    order = db.query(OrderDB).filter(OrderDB.user_id == user_id, OrderDB.is_payed == is_payed).first()
    if not order:
        return {}
    
    user = db.query(UserDB).filter(UserDB.id == order.user_id).first()
    if not user:
        return {}
    
    items = []
    for item in order.items.split("#,#"):
        if item:
            knife_id, amount = map(int, item.split(":"))
            knife = db.query(KnifeDB).filter(KnifeDB.id == knife_id).first()
            if knife:
                knife.images = knife.images.split("#,#")
                items.append((knife, amount))
    
    return {"id": order.id, "user": OrderUser(avatar=user.avatar, username=user.username), "items": items, "is_payed": bool(order.is_payed)}

@orders_router.post("/")
def create_order(request: CreateOrderRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    items_str = "#,#".join([f"{knife_id}:{amount}" for knife_id, amount in request.items])
    
    new_order = OrderDB(user_id=request.user_id, items=items_str, is_payed=int(request.is_payed))

    existing_order = db.query(OrderDB).filter(OrderDB.user_id == request.user_id, OrderDB.is_payed == int(request.is_payed)).first()

    if existing_order is not None:
        existing_order.items = items_str
        db.commit()
        db.refresh(existing_order)
    else:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
    
    return {}

@orders_router.post("/add")
def add_to_order(request: AddToCartRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    existing_order = db.query(OrderDB).filter(OrderDB.user_id == request.user_id, OrderDB.is_payed == request.is_payed).first()
    
    new_item_str = f"{request.items[0]}:{request.items[1]}"

    if not existing_order:
        new_order = OrderDB(user_id=request.user_id, items=new_item_str, is_payed=0)
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
    else:
        new_items = ""
        existing_items = existing_order.items
        add_new = True

        for item in existing_items.split('#,#'):
            knife_id, amount = [int(val) for val in item.split(':')]
            if knife_id == request.items[0]:
                amount += request.items[1]
                add_new = False
            new_items += f'{knife_id}:{amount}#,#'
        
        if add_new:
            new_items += f'{request.items[0]}:{request.items[1]}#,#'

        existing_order.items = new_items[:-3]
        db.commit()
        db.refresh(existing_order)
    
    return {}

@orders_router.put("/{user_id}/pay")
def pay_order(user_id: int, db: Session = Depends(get_db)):  
    existing_order = db.query(OrderDB).filter(OrderDB.user_id == user_id, OrderDB.is_payed == 0).first()
    
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found or already paid.")

    existing_order.is_payed = 1
    db.commit()
    db.refresh(existing_order)
    
    return {}

@orders_router.delete("/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(OrderDB).filter(OrderDB.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted."}

app.include_router(orders_router)

#endregion

#region Auth routes

auth_router = APIRouter(prefix="/authorization", tags=["Authorization"])

@auth_router.post("/signup", response_model=UserResponse)
def sign_up(user_request: UserRequest, db: Session = Depends(get_db)):
    existing_user = db.query(UserDB).filter(UserDB.username == user_request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists.")
    new_user = UserDB(username=user_request.username, password=user_request.password, role=user_request.role, avatar="")
    new_user.token = str(uuid4())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@auth_router.post("/signin", response_model=UserResponse)
def sign_in(user_request: UserRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == user_request.username, UserDB.password == user_request.password).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password.")
    user.token = str(uuid4())
    db.commit()
    db.refresh(user)
    return user


@auth_router.post("/avatar")
def set_avatar(avatar_request: AvatarRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == avatar_request.username, UserDB.token == avatar_request.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username.")
    user.avatar = avatar_request.avatar
    db.commit()
    db.refresh(user)

app.include_router(auth_router)

#endregion

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)