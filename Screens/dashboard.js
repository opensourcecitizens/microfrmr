import React, { useState } from 'react';
import {View,Text,Image,ScrollView,StyleSheet,FlatList,TouchableOpacity, SafeAreaView,Modal,TextInput,} from 'react-native';
import { FontAwesome, MaterialIcons, Feather, MaterialCommunityIcons,} from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import DashboardData from '../appData/dashboardData.json'; // Dashboard data
import ModalData from '../appData/modalData.json'; // Modal data
import ImageMap from '../appData/imageMap'; // Image map

const DashboardScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('Active');

  // --- Reminder Modal States ---
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [wateringReminder, setWateringReminder] = useState('');
  const [fertilizationReminder, setFertilizationReminder] = useState('');
  const [weedingReminder, setWeedingReminder] = useState('');
  const [harvestDeadline, setHarvestDeadline] = useState('');

  // --- Analytics Modal States ---
  const [activeAnalyticsModalVisible, setActiveAnalyticsModalVisible] = useState(false);
  const [yieldingAnalyticsModalVisible, setYieldingAnalyticsModalVisible] = useState(false);
  const [onTillageAnalyticsModalVisible, setOnTillageAnalyticsModalVisible] = useState(false);
  const [selectedAnalyticsCard, setSelectedAnalyticsCard] = useState(null);

  //---Editable Yielding Analytics Modal ---
const [isEditingYield, setIsEditingYield] = useState(false);
const [projectedHarvest, setProjectedHarvest] = useState('');
const [harvestComparison, setHarvestComparison] = useState('');
const [predictedDate, setPredictedDate] = useState('');
const [revenueProjections, setRevenueProjections] = useState('');
const [marketPrices, setMarketPrices] = useState('');


  // --- On Tillage Editable Analytics States ---
  const [tillageSoilPH, setTillageSoilPH] = useState(ModalData['On Tillage'].analytics.soilPH);
  const [tillageOrganicMatter, setTillageOrganicMatter] = useState(ModalData['On Tillage'].analytics.organicMatter);
  const [tillageNitrogen, setTillageNitrogen] = useState(ModalData['On Tillage'].analytics.nutrientLevels.nitrogen);
  const [tillagePhosphorus, setTillagePhosphorus] = useState(ModalData['On Tillage'].analytics.nutrientLevels.phosphorus);
  const [tillagePotassium, setTillagePotassium] = useState(ModalData['On Tillage'].analytics.nutrientLevels.potassium);
  const [tillageCompletion, setTillageCompletion] = useState(ModalData['On Tillage'].analytics.tillageProgress.completion);
  const [tillageAmendments, setTillageAmendments] = useState(ModalData['On Tillage'].analytics.tillageProgress.soilAmmendments);

  // --- Animals Analytics (for Active/Yielding/On Tillage) ---
  const [animalsData, setAnimalsData] = useState(ModalData[selectedStatus].animalsAnalytics || {});

  // Filter dashboard cards based on selectedStatus
  const filteredCards = DashboardData.cards.filter(
    (card) => card.status === selectedStatus
  );

  // === Reminder Modal Functions ===
  const openReminderModal = (cardItem) => {
    setSelectedCard(cardItem);
    const reminders = ModalData[selectedStatus].reminders;
    setWateringReminder(reminders.defaultWatering);
    setFertilizationReminder(reminders.defaultFertilization);
    setWeedingReminder(reminders.defaultWeeding);
    setHarvestDeadline(reminders.defaultHarvestDeadline);
    setReminderModalVisible(true);
  };

  const closeReminderModal = () => {
    setSelectedCard(null);
    setReminderModalVisible(false);
  };

  const handleSaveReminders = () => {
    console.log('Reminders saved for', selectedCard.title, {
      watering: wateringReminder,
      fertilization: fertilizationReminder,
      weeding: weedingReminder,
      harvest: harvestDeadline,
    });
    closeReminderModal();
  };

  const handleClearReminders = () => {
    setWateringReminder('');
    setFertilizationReminder('');
    setWeedingReminder('');
    setHarvestDeadline('');
  };

  const handleDeleteReminders = () => {
    console.log('Reminders deleted for', selectedCard.title);
    setWateringReminder('');
    setFertilizationReminder('');
    setWeedingReminder('');
    setHarvestDeadline('');
    closeReminderModal();
  };

  // === Active Analytics Modal Functions ===
  const openActiveAnalyticsModal = (cardItem) => {
    if (selectedStatus === 'Active') {
      setSelectedAnalyticsCard(cardItem);
      setActiveAnalyticsModalVisible(true);
      setAnimalsData(ModalData['Active'].animalsAnalytics || {});
    }
  };

  const closeActiveAnalyticsModal = () => {
    setSelectedAnalyticsCard(null);
    setActiveAnalyticsModalVisible(false);
  };

  // === Yielding Analytics Modal Functions ===
  const openYieldingAnalyticsModal = (cardItem) => {
    if (selectedStatus === 'Yielding') {
      setSelectedAnalyticsCard(cardItem);
      setYieldingAnalyticsModalVisible(true);
      setAnimalsData(ModalData['Yielding'].animalsAnalytics || {});
    }
  };

  const closeYieldingAnalyticsModal = () => {
    setSelectedAnalyticsCard(null);
    setYieldingAnalyticsModalVisible(false);
  };

  // === On Tillage Analytics Modal Functions (Editable) ===
  const openOnTillageAnalyticsModal = (cardItem) => {
    if (selectedStatus === 'On Tillage') {
      setSelectedAnalyticsCard(cardItem);
      const analytics = ModalData['On Tillage'].analytics;
      setTillageSoilPH(analytics.soilPH);
      setTillageOrganicMatter(analytics.organicMatter);
      setTillageNitrogen(analytics.nutrientLevels.nitrogen);
      setTillagePhosphorus(analytics.nutrientLevels.phosphorus);
      setTillagePotassium(analytics.nutrientLevels.potassium);
      setTillageCompletion(analytics.tillageProgress.completion);
      setTillageAmendments(analytics.tillageProgress.soilAmmendments);
      setAnimalsData(ModalData['On Tillage'].animalsAnalytics || {});
      setOnTillageAnalyticsModalVisible(true);
    }
  };

  const closeOnTillageAnalyticsModal = () => {
    setSelectedAnalyticsCard(null);
    setOnTillageAnalyticsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={ImageMap['Groceries']}
            style={styles.profileImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Baraka Farm House</Text>
            <Text style={styles.subtitle}>Nebraska Omaha</Text>
            <Text style={styles.subtitle}>15 Acres</Text>
            <Text style={styles.title}>Awards</Text>
            <Text style={styles.subtitle}>
              Best AgriTech 2024 || AgriFarm Expo || Best Farm Nebraska ||
            </Text>
          </View>
        </View>

        {/* My Crops and Animals Title */}
        <Text style={styles.sectionTitle}>My Crops and Animals</Text>

        {/* Crop/Animal List */}
        <FlatList
          horizontal
          data={DashboardData.cropsAndAnimals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={ImageMap[item.image]} style={styles.itemImage} />
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />

        {/* Tab Bar for Farm Status */}
        <View style={styles.tabContainer}>
          {['Active', 'Yielding', 'On Tillage'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.tabButton, selectedStatus === status && styles.activeTabButton]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[styles.tabText, selectedStatus === status && styles.activeTabText]}>
                {status} Farms
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cards Section */}
        {filteredCards.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image
              source={ImageMap[item.image]}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.details.map((detail, index) => (
                <Text key={index} style={styles.detailText}>
                  {detail}
                </Text>
              ))}
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => openReminderModal(item)}
                >
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={wp('6.5%')}
                    color="#4EC09C"
                  />
                </TouchableOpacity>
                {selectedStatus === 'Active' ? (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => openActiveAnalyticsModal(item)}
                  >
                    <MaterialIcons
                      name="analytics"
                      size={wp('6.5%')}
                      color="#4EC09C"
                    />
                  </TouchableOpacity>
                ) : selectedStatus === 'Yielding' ? (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => openYieldingAnalyticsModal(item)}
                  >
                    <MaterialIcons
                      name="analytics"
                      size={wp('6.5%')}
                      color="#4EC09C"
                    />
                  </TouchableOpacity>
                ) : selectedStatus === 'On Tillage' ? (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => openOnTillageAnalyticsModal(item)}
                  >
                    <MaterialIcons
                      name="analytics"
                      size={wp('6.5%')}
                      color="#4EC09C"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons
                      name="analytics"
                      size={wp('6.5%')}
                      color="#4EC09C"
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={wp('6.5%')}
                    color="#4EC09C"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons
                    name="edit"
                    size={wp('6.5%')}
                    color="#4EC09C"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- Reminder Modal Styles Cluster --- */}
      <Modal
        visible={reminderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeReminderModal}
      >
        <View style={reminderStyles.modalOverlay}>
          <View style={reminderStyles.modalContainer}>
            <View style={reminderStyles.modalHeader}>
              <Text style={reminderStyles.modalTitle}>Reminders</Text>
              <TouchableOpacity onPress={closeReminderModal}>
                <Feather name="x" size={wp('6%')} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={reminderStyles.modalBody}>
              {selectedCard ? (
                <>
                  <Text style={reminderStyles.modalText}>Set reminders for:</Text>
                  <Text style={reminderStyles.modalCardTitle}>{selectedCard.title}</Text>
                  <Text style={reminderStyles.modalText}>Watering Schedule</Text>
                  <TextInput
                    style={reminderStyles.modalInput}
                    placeholder="Enter watering date & time"
                    value={wateringReminder}
                    onChangeText={setWateringReminder}
                  />
                  <Text style={reminderStyles.modalText}>Fertilization</Text>
                  <TextInput
                    style={reminderStyles.modalInput}
                    placeholder="Enter fertilization date & time"
                    value={fertilizationReminder}
                    onChangeText={setFertilizationReminder}
                  />
                  <Text style={reminderStyles.modalText}>Weeding</Text>
                  <TextInput
                    style={reminderStyles.modalInput}
                    placeholder="Enter weeding date & time"
                    value={weedingReminder}
                    onChangeText={setWeedingReminder}
                  />
                  <Text style={reminderStyles.modalText}>Harvest Deadline</Text>
                  <TextInput
                    style={reminderStyles.modalInput}
                    placeholder="Enter harvest deadline"
                    value={harvestDeadline}
                    onChangeText={setHarvestDeadline}
                  />
                </>
              ) : (
                <Text style={reminderStyles.modalText}>No card selected.</Text>
              )}
            </ScrollView>
            <View style={reminderStyles.modalFooterButtons}>
              <TouchableOpacity style={reminderStyles.modalActionButton} onPress={handleSaveReminders}>
                <Text style={reminderStyles.modalActionText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={reminderStyles.modalActionButton} onPress={handleClearReminders}>
                <Text style={reminderStyles.modalActionText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={reminderStyles.modalActionButton} onPress={handleDeleteReminders}>
                <Text style={reminderStyles.modalActionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- Active Analytics Modal Styles Cluster --- */}
      <Modal
        visible={activeAnalyticsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeActiveAnalyticsModal}
      >
        <View style={activeAnalyticsStyles.modalOverlay}>
          <View style={activeAnalyticsStyles.modalContainer}>
            <View style={activeAnalyticsStyles.modalHeader}>
              <Text style={activeAnalyticsStyles.modalTitle}>Plant Statistics</Text>
              <TouchableOpacity onPress={closeActiveAnalyticsModal}>
                <Feather name="x" size={wp('6%')} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={activeAnalyticsStyles.modalBody}>
              {selectedAnalyticsCard ? (
                <View>
                  <Text style={activeAnalyticsStyles.modalText}>
                    Growth Rate: {ModalData[selectedStatus].analytics.growthRate}
                  </Text>
                  <View style={activeAnalyticsStyles.tableContainer}>
                    <View style={activeAnalyticsStyles.tableRow}>
                      <Text style={activeAnalyticsStyles.tableLabel}>Temperature:</Text>
                      <Text style={activeAnalyticsStyles.tableValue}>
                        {ModalData[selectedStatus].analytics.temperature}
                      </Text>
                    </View>
                    <View style={activeAnalyticsStyles.tableRow}>
                      <Text style={activeAnalyticsStyles.tableLabel}>Soil Moisture:</Text>
                      <Text style={activeAnalyticsStyles.tableValue}>
                        {ModalData[selectedStatus].analytics.soilMoisture}
                      </Text>
                    </View>
                    <View style={activeAnalyticsStyles.tableRow}>
                      <Text style={activeAnalyticsStyles.tableLabel}>Sunlight:</Text>
                      <Text style={activeAnalyticsStyles.tableValue}>
                        {ModalData[selectedStatus].analytics.sunlight}
                      </Text>
                    </View>
                  </View>
                  <Text style={activeAnalyticsStyles.modalText}>Growth Progress</Text>
                  <View style={activeAnalyticsStyles.progressBarContainer}>
                    <View style={activeAnalyticsStyles.progressBarBackground}>
                      <View style={activeAnalyticsStyles.progressBarFill} />
                    </View>
                  </View>
                  {ModalData[selectedStatus].animalsAnalytics && (
                    <>
                      <Text style={activeAnalyticsStyles.modalSubtitle}>Animal Analytics</Text>
                      {Object.entries(ModalData[selectedStatus].animalsAnalytics).map(([key, value]) => (
                        <View key={key} style={activeAnalyticsStyles.tableRow}>
                          <Text style={activeAnalyticsStyles.tableLabel}>{key}:</Text>
                          <TextInput
                            style={[activeAnalyticsStyles.modalInput, { flex: 1 }]}
                            defaultValue={value}
                          />
                        </View>
                      ))}
                    </>
                  )}
                </View>
              ) : (
                <Text style={activeAnalyticsStyles.modalText}>No analytics data available.</Text>
              )}
            </ScrollView>
            <View style={activeAnalyticsStyles.modalFooter}>
              <TouchableOpacity style={activeAnalyticsStyles.closeButton} onPress={closeActiveAnalyticsModal}>
                <Text style={activeAnalyticsStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- Yielding Analytics Modal Styles Cluster --- */}
<Modal
  visible={yieldingAnalyticsModalVisible}
  transparent
  animationType="slide"
  onRequestClose={closeYieldingAnalyticsModal}
>
  <View style={yieldingAnalyticsStyles.modalOverlay}>
    <View style={yieldingAnalyticsStyles.modalContainer}>
      <View style={yieldingAnalyticsStyles.modalHeader}>
        <Text style={yieldingAnalyticsStyles.modalTitle}>Yield Analytics</Text>
        <TouchableOpacity onPress={closeYieldingAnalyticsModal}>
          <Feather name="x" size={wp('6%')} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView style={yieldingAnalyticsStyles.modalBody}>
        {selectedAnalyticsCard ? (
          <View>
            <Text style={yieldingAnalyticsStyles.modalText}>Projected Harvest Quantity</Text>
            <TextInput
              style={yieldingAnalyticsStyles.modalInput}
              placeholder="Enter projected quantity"
              value={projectedHarvest}
              onChangeText={setProjectedHarvest}
              editable={isEditingYield}
            />

            <Text style={yieldingAnalyticsStyles.modalText}>Comparison</Text>
            <TextInput
              style={yieldingAnalyticsStyles.modalInput}
              placeholder="Enter comparison data"
              value={harvestComparison}
              onChangeText={setHarvestComparison}
              editable={isEditingYield}
            />

            <Text style={yieldingAnalyticsStyles.modalText}>Predicted Harvest Date</Text>
            <TextInput
              style={yieldingAnalyticsStyles.modalInput}
              placeholder="MM/DD/YYYY"
              value={predictedDate}
              onChangeText={setPredictedDate}
              editable={isEditingYield}
            />

            <Text style={yieldingAnalyticsStyles.modalText}>Revenue Projections</Text>
            <TextInput
              style={yieldingAnalyticsStyles.modalInput}
              placeholder="Enter revenue projections"
              value={revenueProjections}
              onChangeText={setRevenueProjections}
              editable={isEditingYield}
            />

            <Text style={yieldingAnalyticsStyles.modalText}>Current Market Prices</Text>
            <TextInput
              style={yieldingAnalyticsStyles.modalInput}
              placeholder="Enter current prices"
              value={marketPrices}
              onChangeText={setMarketPrices}
              editable={isEditingYield}
            />

            {/* Animal Analytics Section */}
            {ModalData[selectedStatus].animalsAnalytics && (
              <>
                <Text style={yieldingAnalyticsStyles.modalSubtitle}>Animal Analytics</Text>
                {Object.entries(ModalData[selectedStatus].animalsAnalytics).map(([key, value]) => (
                  <View key={key} style={yieldingAnalyticsStyles.tableRow}>
                    <Text style={yieldingAnalyticsStyles.tableLabel}>{key}:</Text>
                    <TextInput
                      style={[yieldingAnalyticsStyles.modalInput, { flex: 1 }]}
                      placeholder={`Enter ${key}`}
                      defaultValue={value}
                      editable={isEditingYield}
                    />
                  </View>
                ))}
              </>
            )}
          </View>
        ) : (
          <Text style={yieldingAnalyticsStyles.modalText}>No analytics data available.</Text>
        )}
      </ScrollView>
      <View style={yieldingAnalyticsStyles.modalFooterButtons}>
        {!isEditingYield ? (
          <>
            <TouchableOpacity 
              style={yieldingAnalyticsStyles.editButton}
              onPress={() => setIsEditingYield(true)}
            >
              <Text style={yieldingAnalyticsStyles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={yieldingAnalyticsStyles.closeButton}
              onPress={closeYieldingAnalyticsModal}
            >
              <Text style={yieldingAnalyticsStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={yieldingAnalyticsStyles.saveButton}
              onPress={() => {
                console.log('Saved data:', {
                  projectedHarvest,
                  harvestComparison,
                  predictedDate,
                  revenueProjections,
                  marketPrices
                });
                setIsEditingYield(false);
              }}
            >
              <Text style={yieldingAnalyticsStyles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={yieldingAnalyticsStyles.clearButton}
              onPress={() => {
                setProjectedHarvest('');
                setHarvestComparison('');
                setPredictedDate('');
                setRevenueProjections('');
                setMarketPrices('');
              }}
            >
              <Text style={yieldingAnalyticsStyles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </View>
</Modal>

      {/* --- On Tillage Analytics Modal Styles Cluster --- */}
      <Modal
        visible={onTillageAnalyticsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeOnTillageAnalyticsModal}
      >
        <View style={tillageAnalyticsStyles.modalOverlay}>
          <View style={tillageAnalyticsStyles.modalContainer}>
            <View style={tillageAnalyticsStyles.modalHeader}>
              <Text style={tillageAnalyticsStyles.modalTitle}>Tillage Analytics</Text>
              <TouchableOpacity onPress={closeOnTillageAnalyticsModal}>
                <Feather name="x" size={wp('6%')} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={tillageAnalyticsStyles.modalBody}>
              {selectedAnalyticsCard ? (
                <View>
                  <Text style={tillageAnalyticsStyles.modalText}>Soil pH:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillageSoilPH}
                    onChangeText={setTillageSoilPH}
                  />
                  <Text style={tillageAnalyticsStyles.modalText}>Organic Matter:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillageOrganicMatter}
                    onChangeText={setTillageOrganicMatter}
                  />
                  <Text style={tillageAnalyticsStyles.modalText}>Nitrogen:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillageNitrogen}
                    onChangeText={setTillageNitrogen}
                  />
                  <Text style={tillageAnalyticsStyles.modalText}>Phosphorus:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillagePhosphorus}
                    onChangeText={setTillagePhosphorus}
                  />
                  <Text style={tillageAnalyticsStyles.modalText}>Potassium:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillagePotassium}
                    onChangeText={setTillagePotassium}
                  />
                  <Text style={tillageAnalyticsStyles.modalText}>Tillage Completion:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillageCompletion}
                    onChangeText={setTillageCompletion}
                  />
                  <Text style={tillageAnalyticsStyles.modalText}>Soil Amendments:</Text>
                  <TextInput
                    style={tillageAnalyticsStyles.modalInput}
                    value={tillageAmendments}
                    onChangeText={setTillageAmendments}
                  />
                  {ModalData['On Tillage'].animalsAnalytics && (
                    <>
                      <Text style={tillageAnalyticsStyles.modalSubtitle}>Animal Analytics</Text>
                      {Object.entries(ModalData['On Tillage'].animalsAnalytics).map(([key, value]) => (
                        <View key={key} style={tillageAnalyticsStyles.tableRow}>
                          <Text style={tillageAnalyticsStyles.tableLabel}>{key}:</Text>
                          <TextInput
                            style={[tillageAnalyticsStyles.modalInput, { flex: 1 }]}
                            defaultValue={value}
                          />
                        </View>
                      ))}
                    </>
                  )}
                </View>
              ) : (
                <Text style={tillageAnalyticsStyles.modalText}>No analytics data available.</Text>
              )}
            </ScrollView>
            <View style={tillageAnalyticsStyles.modalFooterButtons}>
              <TouchableOpacity style={tillageAnalyticsStyles.modalActionButton} onPress={closeOnTillageAnalyticsModal}>
                <Text style={tillageAnalyticsStyles.modalActionText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tillageAnalyticsStyles.modalActionButton} onPress={closeOnTillageAnalyticsModal}>
                <Text style={tillageAnalyticsStyles.modalActionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const closeOnTillageAnalyticsModal = () => {
  setSelectedAnalyticsCard(null);
  setOnTillageAnalyticsModalVisible(false);
};


/* =========================== */
/*       Global Styles        */
/* =========================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('6%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#4EC09C',
  },
  profileImage: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('6%'),
    marginRight: wp('3%'),
    borderColor: '#fff',
    borderWidth: 3,
  },
  headerTextContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    color: '#fff',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: wp('4%'),
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  itemContainer: {
    alignItems: 'center',
    margin: wp('2%'),
  },
  itemImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    borderColor: '#4EC09C',
    borderWidth: 1,
  },
  itemText: {
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: hp('1%'),
  },
  tabButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  tabText: {
    fontSize: wp('4%'),
    color: '#333',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#4EC09C',
  },
  activeTabText: {
    color: '#4EC09C',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    margin: wp('2%'),
    flexDirection: 'row',
    minHeight: hp('20%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: wp('35%'),
    height: wp('35%'),
    borderRadius: wp('3%'),
    marginRight: wp('4%'),
    borderColor: '#4EC09C',
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  iconButton: {
    padding: wp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#f5faf9',
  },
});

/* =========================== */
/*   Reminder Modal Styles    */
/* =========================== */

const reminderStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('78%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: hp('2%'),
  },
  modalText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginBottom: hp('1%'),
  },
  modalCardTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#4EC09C',
    marginBottom: hp('1%'),
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    marginBottom: hp('1%'),
    fontSize: wp('3.5%'),
  },
  modalFooterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
  },
  modalActionButton: {
    backgroundColor: '#4EC09C',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  modalActionText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
});

/* =========================== */
/*  Active Analytics Modal    */
/* =========================== */

const activeAnalyticsStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('80%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: hp('2%'),
  },
  modalText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginBottom: hp('1%'),
  },
  tableContainer: {
    marginVertical: hp('2%'),
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  tableLabel: {
    fontSize: wp('3%'),
    color: '#333',
    fontWeight: 'bold',
  },
  tableValue: {
    fontSize: wp('3.5%'),
    color: '#4EC09C',
  },
  progressBarContainer: {
    marginVertical: hp('2%'),
  },
  progressBarBackground: {
    width: '100%',
    height: hp('2%'),
    backgroundColor: '#eee',
    borderRadius: wp('1%'),
  },
  progressBarFill: {
    width: '75%', // placeholder
    height: '100%',
    backgroundColor: '#4EC09C',
    borderRadius: wp('1%'),
  },
  modalSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1%'),
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    marginBottom: hp('1%'),
    fontSize: wp('3.5%'),
  },
  modalFooter: {
    alignItems: 'flex-end',
  },
  closeButton: {
    backgroundColor: '#4EC09C',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
});

/* =========================== */
/* Yielding Analytics Modal   */
/* =========================== */

const yieldingAnalyticsStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('80%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: hp('2%'),
  },
  modalText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginBottom: hp('1%'),
  },
  modalSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1%'),
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  tableLabel: {
    fontSize: wp('3%'),
    color: '#333',
    fontWeight: 'bold',
  },
 
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    marginBottom: hp('1%'),
    fontSize: wp('3.5%'),
  },
 
  closeButton: {
    backgroundColor: '#4EC09C',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
 
   modalFooterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
  },
  editButton: {
    backgroundColor: '#4EC09C',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  saveButton: {
    backgroundColor: '#4EC09C',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  clearButton: {
    backgroundColor: '#FF6347',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  closeButton: {
    backgroundColor: '#666',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },

});

/* =========================== */
/* On Tillage Analytics Modal */
/* =========================== */

const tillageAnalyticsStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: hp('2%'),
  },
  modalText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginBottom: hp('1%'),
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    marginBottom: hp('1%'),
    fontSize: wp('3.5%'),
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  tableLabel: {
    fontSize: wp('3%'),
    color: '#333',
    fontWeight: 'bold',
  },
 
  modalFooterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
  },
  modalActionButton: {
    backgroundColor: '#4EC09C',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  modalActionText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
   modalContainer: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    maxHeight: hp('80%'), // Add max height for better scrolling
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('3%'), // Increased padding
    marginBottom: hp('1.5%'), // Increased spacing
    fontSize: wp('3.5%'),
  },
  modalFooterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Better button spacing
    marginTop: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
});

export default DashboardScreen;
