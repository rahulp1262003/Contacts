import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import { firebase } from '../config';
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/GlobalStyles";
import firebaseUrl from "../components/firebase/firebase";

function ContactList({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const sectionListRef = useRef(null);

  useEffect(() => {
    const reference = firebaseUrl('/contacts');

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

  // Group contacts by the first letter of their firstName
  const groupContactsByLetter = () => {
    const grouped = {};
    contacts.forEach((contact) => {
      const firstLetter = contact.firstName[0].toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(contact);
    });

    // Convert to SectionList format
    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter],
      }));
  };

  const sections = groupContactsByLetter();

  const scrollToSection = (sectionIndex) => {
    sectionListRef.current.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      animated: true,
      viewOffset: 0,
    });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setSelectedItems([]);
      setSelectAll(false);
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
      setSelectedItems([]);
    } else {
      const allIds = contacts.map((contact) => contact.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (editMode) {
          toggleSelectItem(item.id);
        } else {
          navigation.navigate('ContactDetails', { contact: item });
        }
      }}
      onLongPress={toggleEditMode}
      delayLongPress={500}
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

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const AlphabetScrollbar = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
      <View style={styles.scrollbar}>
        {alphabet.map((letter) => (
          <TouchableOpacity
            key={letter}
            onPress={() => {
              const sectionIndex = sections.findIndex((section) => section.title === letter);
              if (sectionIndex !== -1) {
                scrollToSection(sectionIndex);
              }
            }}
          >
            <Text style={styles.scrollbarText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
            {loading ? (
              <ActivityIndicator size='large' color={colors.Black} />
            ) : contacts.length > 0 ? (
              <>
                <SectionList
                  ref={sectionListRef}
                  sections={sections}
                  renderItem={renderItem}
                  renderSectionHeader={renderSectionHeader}
                  keyExtractor={(item) => item.id}
                />
                <AlphabetScrollbar />
              </>
            ) : (
              <Text style={{ textAlign: 'center' }}>No Contacts Found</Text>
            )}
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
  // titleContainer: {
  //   marginVertical: 40,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   width: '90%',
  // },
  title: {
    fontSize: 40,
    textAlign: 'center',
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
    marginVertical: 1,
    // marginHorizontal: 10,
    // borderRadius: 18,
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
    gap: 15,
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
    borderRadius: 12,
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
    borderRadius: 10,
    backgroundColor: colors.lightBlue,
  },
  sectionHeader: {
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollbar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollbarText: {
    fontSize: 12,
    marginVertical: 2,
  },
});