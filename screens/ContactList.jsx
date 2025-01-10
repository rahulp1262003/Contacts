import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { firebase } from '../config';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/GlobalStyles";

function ContactList({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const reference = firebase.database().ref('/contacts');
    const onValueChange = reference.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setContacts(formattedData);
      } else {
        setContacts([]);
      }
      setLoading(false);
    });

    return () => reference.off('value', onValueChange);
  }, []);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setSelectedItems([]); // Clear selected items when exiting edit mode
      setSelectAll(false); // Reset "Select All" state
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert("No Selection", "Please select at least one contact to delete.");
      return;
    }

    Alert.alert(
      "Delete Contacts",
      "Are you sure you want to delete the selected contacts?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            selectedItems.forEach((id) => {
              firebase.database().ref(`/contacts/${id}`).remove();
            });
            setEditMode(false);
            setSelectedItems([]);
            setSelectAll(false);
          },
        },
      ]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all items
      setSelectedItems([]);
    } else {
      // Select all items
      const allIds = contacts.map((contact) => contact.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll); // Toggle "Select All" state
  };

  const CircleCheckbox = ({ selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.circleCheckbox,
        selected && styles.circleCheckboxSelected,
      ]}
    >
      {selected && <View style={styles.circleCheckboxInner} />}
    </TouchableOpacity>
  );

  const renderedItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (editMode) {
          toggleSelectItem(item.id);
        } else {
          navigation.navigate('EditContact', { contact: item });
        }
      }}
      onLongPress={toggleEditMode}
      delayLongPress={500} // Adjust delay as needed
    >
      <View style={styles.card}>
        {editMode && (
          <CircleCheckbox
            selected={selectedItems.includes(item.id)}
            onPress={() => toggleSelectItem(item.id)}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.details}>{item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleTapOutside = () => {
    if (editMode) {
      setEditMode(false);
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTapOutside}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.rootContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Contacts</Text>
            {editMode && (
              <View style={styles.editModeButtons}>
                <TouchableOpacity onPress={handleSelectAll}>
                  <Text style={styles.selectAllButton}>
                    {selectAll ? "Deselect All" : "Select All"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteSelectedItems}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={[styles.listItemContainer, contacts.length > 0 ? '' : styles.listCenter]}>
            {loading
              ?
              (<ActivityIndicator size='large' color={colors.Black} />)
              : contacts.length > 0
                ?
                (
                  <FlatList data={contacts} renderItem={renderedItem} keyExtractor={(item) => item.id} />
                )
                : (<Text style={{ textAlign: 'center' }}>No Contacts Found</Text>)
            }
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default ContactList;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  titleContainer: {
    marginVertical: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    // backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 40,
    textAlign: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
  },
  card: {
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 18,
    backgroundColor: colors.White,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  listItemContainer: {
    flex: 1,
    width: '100%',
  },
  listCenter: {
    justifyContent: 'center',
  },
  editModeButtons: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15, // Space between buttons
    // backgroundColor: '#ddddfe'
  },
  deleteButton: {
    color: colors.Red,
    fontSize: 15,
  },
  selectAllButton: {
    color: colors.lightBlue,
    fontSize: 15,
  },
  circleCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12, // Circle shape
    borderWidth: 2,
    borderColor: colors.Black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCheckboxSelected: {
    borderColor: colors.lightBlue,
  },
  circleCheckboxInner: {
    width: 16,
    height: 16,
    borderRadius: 10, // Inner circle
    backgroundColor: colors.lightBlue,
  },
});