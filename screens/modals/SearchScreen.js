// SearchScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Platform
} from 'react-native';
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
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  // (La logique reste la même — imports db/getDocs laissés tels quels)
  // const handleSearch = () => { ... } remplacé par l'implémentation suivante (identique à la tienne)
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
        <Text style={styles.headerSubtitle}>Trouver rapidement</Text>
        <Text style={styles.headerTitle}>Rechercher un bien</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            placeholder="Ville, quartier, mot-clé..."
            placeholderTextColor={COLORS.gray}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.filterQuick,
            pressed && styles.filterQuickPressed
          ]}
          onPress={() => setShowLocationModal(true)}
        >
          <Ionicons name="options" size={20} color={COLORS.white} />
        </Pressable>
      </View>

      {/* Transaction Type */}
      <View style={styles.segment}>
        <Pressable
          style={[
            styles.segmentBtn,
            transactionType === 'rent' && styles.segmentBtnActive
          ]}
          onPress={() => setTransactionType('rent')}
        >
          <Text style={[
            styles.segmentText,
            transactionType === 'rent' && styles.segmentTextActive
          ]}>À louer</Text>
        </Pressable>
        <Pressable
          style={[
            styles.segmentBtn,
            transactionType === 'buy' && styles.segmentBtnActive
          ]}
          onPress={() => setTransactionType('buy')}
        >
          <Text style={[
            styles.segmentText,
            transactionType === 'buy' && styles.segmentTextActive
          ]}>À acheter</Text>
        </Pressable>
      </View>

      {/* Property Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type de propriété</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typesScroll}
        >
          {propertyTypes.map((type) => {
            const selected = selectedPropertyType === type.id;
            return (
              <Pressable
                key={type.id}
                android_ripple={{ color: COLORS.lightPrimary }}
                onPress={() => setSelectedPropertyType(selected ? '' : type.id)}
                style={[styles.typeCard, selected && styles.typeCardSelected]}
              >
                <View style={[styles.typeIconWrap, selected && styles.typeIconWrapSelected]}>
                  <MaterialIcons
                    name={type.icon}
                    size={22}
                    color={selected ? COLORS.white : COLORS.primary}
                  />
                </View>
                <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>
                  {type.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Filters */}
      <ScrollView style={styles.filtersContainer} contentContainerStyle={{ paddingBottom: 24 }}>
        <TouchableOpacity style={styles.filterItem} onPress={() => setShowLocationModal(true)}>
          <View>
            <Text style={styles.filterLabel}>Localisation</Text>
            <Text style={styles.filterValueSmall}>{selectedlocation || 'Toutes les villes'}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={22} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem} onPress={() => setShowPriceModal(true)}>
          <View>
            <Text style={styles.filterLabel}>Prix (FCFA)</Text>
            <Text style={styles.filterValueSmall}>
              {minPrice || maxPrice ? `${minPrice || 'Min'} - ${maxPrice || 'Max'}` : 'Tous les prix'}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={22} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem} onPress={() => setShowBedroomModal(true)}>
          <View>
            <Text style={styles.filterLabel}>Chambres</Text>
            <Text style={styles.filterValueSmall}>{selectedBedrooms || 'Toutes'}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={22} color={COLORS.gray} />
        </TouchableOpacity>

      </ScrollView>

      {/* Search Button */}
      <TouchableOpacity activeOpacity={0.9} style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>

      {/* Modals */}

      {/* Location Modal */}
      <Modal visible={showLocationModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une ville</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={beninCities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalRow}
                  onPress={() => {
                    setSelectedlocation(item);
                    setShowLocationModal(false);
                  }}
                >
                  <Text style={styles.modalRowText}>{item}</Text>
                  {selectedlocation === item && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>

      {/* Price Modal */}
      <Modal visible={showPriceModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer par prix (FCFA)</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.priceBox}>
                <Text style={styles.smallLabel}>Minimum</Text>
                <TextInput
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.gray}
                  style={styles.priceInput}
                />
              </View>

              <View style={styles.priceBox}>
                <Text style={styles.smallLabel}>Maximum</Text>
                <TextInput
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                  placeholder="Aucune limite"
                  placeholderTextColor={COLORS.gray}
                  style={styles.priceInput}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.modalApply} onPress={() => setShowPriceModal(false)}>
              <Text style={styles.modalApplyText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bedroom Modal */}
      <Modal visible={showBedroomModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nombre de chambres</Text>
              <TouchableOpacity onPress={() => setShowBedroomModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={['Toutes', ...bedrooms]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalRow}
                  onPress={() => {
                    setSelectedBedrooms(item === 'Toutes' ? '' : item);
                    setShowBedroomModal(false);
                  }}
                >
                  <Text style={styles.modalRowText}>{item}</Text>
                  {(selectedBedrooms === item || (item === 'Toutes' && !selectedBedrooms)) && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: COLORS.background || COLORS.white,
    padding: SIZES.padding,
  },
  header: {
    marginBottom: SIZES.base,
  },
  headerSubtitle: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginBottom: 4,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.black,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    ...FONTS.body4,
    color: COLORS.black,
    flex: 1,
    paddingVertical: 0,
  },
  filterQuick: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  filterQuickPressed: {
    opacity: 0.85,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
    overflow: 'hidden'
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 999,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontWeight: '500'
  },
  segmentTextActive: {
    color: COLORS.white
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...FONTS.h4,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10
  },
  typesScroll: {
    paddingHorizontal: 2,
  },
  typeCard: {
    width: 92,
    height: 92,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  typeCardSelected: {
    backgroundColor: COLORS.primary,
  },
  typeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  typeIconWrapSelected: {
    backgroundColor: COLORS.white + '00', // keep icon visible via color toggle
  },
  typeLabel: {
    ...FONTS.body5,
    color: COLORS.darkGray,
    textAlign: 'center'
  },
  typeLabelSelected: {
    color: COLORS.white,
    fontWeight: '700'
  },
  filtersContainer: {
    marginTop: 6,
    marginBottom: 8,
    flex: 1
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface || COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 3,
  },
  filterLabel: {
    ...FONTS.body4,
    color: COLORS.black,
    fontWeight: '600',
  },
  filterValueSmall: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginTop: 4
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  searchButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: '800'
  },

  /* Modals */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalTitle: {
    ...FONTS.h4,
    fontWeight: '700'
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center'
  },
  modalRowText: {
    ...FONTS.body4,
    color: COLORS.black
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  },
  priceBox: {
    width: '48%'
  },
  smallLabel: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginBottom: 6
  },
  priceInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    ...FONTS.body4,
    backgroundColor: '#FAFAFA'
  },
  modalApply: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  modalApplyText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '700'
  }
});

export default SearchScreen;
