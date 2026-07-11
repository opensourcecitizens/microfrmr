import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getPosts, loadProfile, saveProfile, updatePost } from '../appData/postsStore';

export default function FarmProfileSettingsScreen({ navigation, route }) {
  const initialPost = route?.params?.post || getPosts()[0] || null;
  const [farmName, setFarmName] = useState(initialPost?.farmName || '');
  const [farmAddress, setFarmAddress] = useState(initialPost?.farmAddress || '');
  const [farmDetails, setFarmDetails] = useState(initialPost?.farmDetails || '');
  const [farmerName, setFarmerName] = useState(initialPost?.farmerName || '');
  const [status, setStatus] = useState(initialPost?.status || 'Active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await loadProfile('demo-user');
        if (profile) {
          setFarmName(profile.name || profile.farmName || farmName);
          setFarmAddress(profile.location?.address || farmAddress);
          setFarmDetails(profile.bio || farmDetails);
          setFarmerName(profile.name || farmerName);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    if (!initialPost) {
      return;
    }

    updatePost(initialPost.id, {
      farmName,
      farmAddress,
      farmDetails,
      farmerName,
      status
    });

    await saveProfile({
      id: 'demo-user',
      name: farmerName,
      farmName,
      farmAddress,
      farmDetails,
      bio: farmDetails,
      status
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={wp('6%')} color="#45cca3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farm Profile Settings</Text>
        <TouchableOpacity onPress={handleSave}>
          <Feather name="check" size={wp('6%')} color="#45cca3" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}><ActivityIndicator size="large" color="#45cca3" /></View>
      ) : (
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Farm Name</Text>
        <TextInput style={styles.input} value={farmName} onChangeText={setFarmName} />

        <Text style={styles.label}>Farm Address</Text>
        <TextInput style={styles.input} value={farmAddress} onChangeText={setFarmAddress} />

        <Text style={styles.label}>Farm Details</Text>
        <TextInput style={styles.input} value={farmDetails} onChangeText={setFarmDetails} multiline />

        <Text style={styles.label}>Farmer Name</Text>
        <TextInput style={styles.input} value={farmerName} onChangeText={setFarmerName} />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {['Active', 'Yielding', 'On Tillage'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.statusChip, status === option && styles.statusChipActive]}
              onPress={() => setStatus(option)}
            >
              <Text style={[styles.statusText, status === option && styles.statusTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: wp('4.5%'), fontWeight: '700', color: '#333' },
  formContainer: { padding: wp('4%') },
  label: { fontSize: wp('4%'), fontWeight: '600', color: '#333', marginTop: hp('2%'), marginBottom: hp('1%') },
  input: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    padding: wp('3%'),
    fontSize: wp('4%')
  },
  statusRow: { flexDirection: 'row', gap: wp('2%') },
  statusChip: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#eee',
    alignItems: 'center'
  },
  statusChipActive: { backgroundColor: '#45cca3' },
  statusText: { color: '#333', fontWeight: '600' },
  statusTextActive: { color: '#fff' },
  loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
