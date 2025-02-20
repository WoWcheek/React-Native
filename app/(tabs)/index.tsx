import { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";

interface Contact {
    name: string;
    phoneNumber?: string;
    nameMode: boolean;
}

const ContactCard = ({
    contact,
    onPress
}: {
    contact: Contact;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.name}>
                {contact.nameMode
                    ? contact.name
                    : contact.phoneNumber || "No number"}
            </Text>
        </TouchableOpacity>
    );
};

const HomeScreen = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers]
                });

                setContacts(
                    data
                        .filter(x => x.name.length < 30)
                        .map(contact => ({
                            name: contact.name,
                            phoneNumber: contact.phoneNumbers?.[0]?.number,
                            nameMode: true
                        }))
                );
            }
        })();
    }, []);

    const toggleMode = (index: number) => {
        setContacts(prevContacts =>
            prevContacts.map((contact, i) =>
                i === index
                    ? { ...contact, nameMode: !contact.nameMode }
                    : contact
            )
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {contacts.length > 0 ? (
                contacts.map((contact, i) => (
                    <ContactCard
                        key={i}
                        contact={contact}
                        onPress={() => toggleMode(i)}
                    />
                ))
            ) : (
                <Text style={styles.noContacts}>No contacts found</Text>
            )}
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        width: "90%",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center"
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333"
    },
    noContacts: {
        fontSize: 16,
        color: "#999",
        marginTop: 20
    }
});
