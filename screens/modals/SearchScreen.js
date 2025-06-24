
//  SearchScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { db } from '../../src/api/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Villes béninoises
const beninCities = [
  'Cotonou, Littoral, Bénin',
  'Porto-Novo, Ouémé, Bénin',
  'Parakou, Borgou, Bénin',
  'Abomey-Calavi, Atlantique, Bénin',
  'Kétou, Plateau, Bénin',
  'Djougou, Donga, Bénin',
  'Bohicon, Zou, Bénin',
  'Natitingou, Atacora, Bénin',
  'Lokossa, Mono, Bénin',
  'Ouidah, Atlantique, Bénin',
  'Abomey, Zou, Bénin',
  'Kandi, Alibori, Bénin',
  'Malanville, Alibori, Bénin',
  'Savalou, Collines, Bénin'
];

const propertyTypes = [
  { id: 'chambre', name: 'Chambre', icon: 'single-bed' },
  { id: 'studio', name: 'Studio', icon: 'apartment' },
  { id: 'appartement', name: 'Appartement', icon: 'meeting-room' },
  { id: 'maison', name: 'Maison', icon: 'home-work' },
  { id: 'terrain', name: 'Terrain', icon: 'map' },
  { id: 'commercial', name: 'Commercial', icon: 'store' },
];

const bedrooms = ['1', '2', '3', '4', '5+'];

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState('rent');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showBedroomModal, setShowBedroomModal] = useState(false);
  const [selectedlocation, setSelectedlocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  //modif
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  // const handleSearch = () => {
  //   navigation.navigate('SearchResults', { 
  //     searchQuery,
  //     transactionType,
  //     location: selectedlocation,
  //     minPrice,
  //     maxPrice,
  //     bedrooms: selectedBedrooms
  //   });
  // };
  const handleSearch = () => {
  navigation.navigate('SearchResults', { 
    searchQuery,
    transactionType,
    location: selectedlocation,
    minPrice,
    maxPrice,
    bedrooms: selectedBedrooms,
    propertyType: selectedPropertyType
  });
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rechercher un bien</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par ville, quartier..."
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Transaction Type */}
      <View style={styles.section}>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'rent' && styles.activeTypeButton
            ]}
            onPress={() => setTransactionType('rent')}
          >
            <Text style={[
              styles.typeText,
              transactionType === 'rent' && styles.activeTypeText
            ]}>
              À louer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'buy' && styles.activeTypeButton
            ]}
            onPress={() => setTransactionType('buy')}
          >
            <Text style={[
              styles.typeText,
              transactionType === 'buy' && styles.activeTypeText
            ]}>
              À acheter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <ScrollView style={styles.filtersContainer}>
        {/* Location Filter */}
        <TouchableOpacity 
          style={styles.filterItem} 
          onPress={() => setShowLocationModal(true)}
        >
          <Text style={styles.filterLabel}>Localisation</Text>
          <View style={styles.filterValueContainer}>
            <Text style={styles.filterValue}>{selectedlocation || 'Toutes les villes'}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.gray} />
          </View>
        </TouchableOpacity>

        {/* Price Filter */}
        <TouchableOpacity 
          style={styles.filterItem} 
          onPress={() => setShowPriceModal(true)}
        >
          <Text style={styles.filterLabel}>Prix</Text>
          <View style={styles.filterValueContainer}>
            <Text style={styles.filterValue}>
              {minPrice || maxPrice ? `${minPrice || 'Min'} - ${maxPrice || 'Max'}` : 'Tous les prix'}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.gray} />
          </View>
        </TouchableOpacity>

        {/* Bedrooms Filter */}
        <TouchableOpacity 
          style={styles.filterItem} 
          onPress={() => setShowBedroomModal(true)}
        >
          <Text style={styles.filterLabel}>Chambres</Text>
          <View style={styles.filterValueContainer}>
            <Text style={styles.filterValue}>{selectedBedrooms || 'Toutes'}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.gray} />
          </View>
        </TouchableOpacity>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de propriété</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typesScroll}
          >
            {/* {propertyTypes.map((type) => (
              <TouchableOpacity 
                key={type.id}
                style={styles.typeCard}
                onPress={() => navigation.navigate('SearchResults', {
                  propertyType: type.id,
                  transactionType
                })}
              >
                <View style={styles.typeIconContainer}>
                  <MaterialIcons name={type.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.typeName}>{type.name}</Text>
              </TouchableOpacity>
            ))} */}
            {/* {propertyTypes.map((type) => (
              <TouchableOpacity 
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedPropertyType === type.id && { borderColor: COLORS.primary, borderWidth: 2 }
                ]}
                onPress={() => setSelectedPropertyType(type.id)}
              >
                <View style={styles.typeIconContainer}>
                  <MaterialIcons name={type.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.typeName}>{type.name}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>
        </View> */}
        {/* Property Type */}
        
          {propertyTypes.map((type) => (
            <TouchableOpacity 
              key={type.id}
              style={[
                styles.typeCard,
                selectedPropertyType === type.id && styles.selectedTypeCard
              ]}
              onPress={() => {
                // Permet de sélectionner/désélectionner
                if (selectedPropertyType === type.id) {
                  setSelectedPropertyType('');
                } else {
                  setSelectedPropertyType(type.id);
                }
              }}
            >
              <View style={[
                styles.typeIconContainer,
                selectedPropertyType === type.id && styles.selectedTypeIconContainer
              ]}>
                <MaterialIcons 
                  name={type.icon} 
                  size={24} 
                  color={selectedPropertyType === type.id ? COLORS.white : COLORS.primary} 
                />
              </View>
              <Text style={[
                styles.typeName,
                selectedPropertyType === type.id && styles.selectedTypeName
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View>
        </ScrollView>

      {/* Search Button */}
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={handleSearch}
      >
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>

      {/* Location Modal */}
      <Modal visible={showLocationModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une ville</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={beninCities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedlocation(item);
                    setShowLocationModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {selectedlocation === item && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Price Modal */}
      <Modal visible={showPriceModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer par prix (FCFA)</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceLabel}>Minimum</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceLabel}>Maximum</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Aucune limite"
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowPriceModal(false)}
            >
              <Text style={styles.modalButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bedroom Modal */}
      <Modal visible={showBedroomModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nombre de chambres</Text>
              <TouchableOpacity onPress={() => setShowBedroomModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={['Toutes', ...bedrooms]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedBedrooms(item === 'Toutes' ? '' : item);
                    setShowBedroomModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {(selectedBedrooms === item || (item === 'Toutes' && !selectedBedrooms)) && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  header: {
    marginBottom: SIZES.padding,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 1.5,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.padding,
  },
  searchIcon: {
    marginRight: SIZES.base,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body4,
    color: COLORS.black,
    paddingVertical: 0,
  },
  typeContainer: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
  },
  typeButton: {
    flex: 1,
    paddingVertical: SIZES.base * 1.5,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  activeTypeText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flex: 1,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterLabel: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  filterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterValue: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginRight: SIZES.base,
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: SIZES.base * 2,
  },
  typesScroll: {
    paddingRight: SIZES.padding,
  },
  typeCard: {
    width: 80,
    alignItems: 'center',
    marginRight: SIZES.base * 2,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
  },
  selectedTypeCard: {
    backgroundColor: COLORS.lightPrimary, // Une version plus claire de votre couleur primaire
  },
  typeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  selectedTypeIconContainer: {
    backgroundColor: COLORS.primary,
  },
  typeName: {
    ...FONTS.body5,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  selectedTypeName: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
/////
  // typeCard: {
  //   width: 100,
  //   alignItems: 'center',
  //   marginRight: SIZES.base * 2,
  // },
  // typeIconContainer: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 30,
  //   backgroundColor: COLORS.lightGray,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: SIZES.base,
  // },
  // typeName: {
  //   ...FONTS.body4,
  //   color: COLORS.black,
  //   textAlign: 'center',
  // },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.base,
  },
  searchButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  modalTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalItemText: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  priceInputWrapper: {
    width: '48%',
  },
  priceLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    ...FONTS.body4,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  modalButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
export default SearchScreen;
// ... (les styles restent les mêmes que dans le code précédent)