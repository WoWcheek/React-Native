import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC

def parse_and_save(url, output_file):
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    time.sleep(3)
    
    divs = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.container-module .item.swiper-slide')))
    weapons = []
    
    for div in divs:
        brand = div.find_element(By.CLASS_NAME, 'product-model').text if div.find_elements(By.CLASS_NAME, 'product-model') else ""
        imageUri = div.find_element(By.CSS_SELECTOR, 'img').get_attribute('src') if div.find_elements(By.CSS_SELECTOR, 'img') else ""
        isSale = bool(div.find_elements(By.CLASS_NAME, 'special'))
        isSalesHit = bool(div.find_elements(By.CLASS_NAME, 'bestseller'))
        isTop = bool(div.find_elements(By.CLASS_NAME, 'popular'))
        isAvailable = bool(div.find_elements(By.CLASS_NAME, 'instock'))
        title = div.find_element(By.CLASS_NAME, 'product-name').find_element(By.TAG_NAME, 'a').text if div.find_elements(By.CLASS_NAME, 'product-name') else ""
        initialPrice = div.find_element(By.CLASS_NAME, 'price-old').find_element(By.CLASS_NAME, 'price_value').text.replace(" грн", "") if div.find_elements(By.CLASS_NAME, 'price-old') else ""
        discount = div.find_element(By.CLASS_NAME, 'price-old').find_element(By.CLASS_NAME, 'procent-skidka').text.replace("-", "").replace(" %", "") if div.find_elements(By.CLASS_NAME, 'price-old') else ""
        finalPrice = div.find_element(By.CLASS_NAME, 'price-new').find_element(By.CLASS_NAME, 'special_value').text.replace(" грн", "") if div.find_elements(By.CLASS_NAME, 'price-new') else ""
        
        weapons.append({
            "brand": brand,
            "imageUri": imageUri,
            "isSale": isSale,
            "isSalesHit": isSalesHit,
            "isTop": isTop,
            "isAvailable": isAvailable,
            "title": title,
            "initialPrice": initialPrice,
            "discount": discount,
            "finalPrice": finalPrice
        })
    
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(weapons, file, ensure_ascii=False, indent=4)
    
    driver.quit()

url = "https://m416.com.ua"
output_file = "output.json"
parse_and_save(url, output_file)
