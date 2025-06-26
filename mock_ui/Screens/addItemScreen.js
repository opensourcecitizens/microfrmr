import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image 
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';

export default function AddPost({ navigation }) {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeDetails, setStoreDetails] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!storeName || !storeAddress || !description) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newPost = {
      id: Date.now(),
      storeName,
      storeAddress,
      storeDetails,
      status,
      images,
      description
    };

    console.log('New Post:', newPost);
    //todo call APICaller

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={wp('6%')} color="#45cca3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Post</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Feather name="check" size={wp('6%')} color="#45cca3" />
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Farm Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Farm name"
            value={storeName}
            onChangeText={setStoreName}
          />

          <Text style={styles.label}>Farm Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Farm address"
            value={storeAddress}
            onChangeText={setStoreAddress}
          />

          <Text style={styles.label}>Farm Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter brief farm description"
            value={storeDetails}
            onChangeText={setStoreDetails}
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity 
              style={[styles.statusButton, status === 'Active' && styles.activeStatus]}
              onPress={() => setStatus('Active')}
            >
              <Text style={[styles.statusText, status === 'Active' && styles.activeStatusText]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statusButton, status === 'On Tillage' && styles.activeStatus]}
              onPress={() => setStatus('On Tillage')}
            >
              <Text style={[styles.statusText, status === 'On Tillage' && styles.activeStatusText]}>On Tillage</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statusButton, status === 'Yielding' && styles.activeStatus]}
              onPress={() => setStatus('Yielding')}
            >
              <Text style={[styles.statusText, status === 'Yielding' && styles.activeStatusText]}>Yielding</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Upload Images</Text>
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <FontAwesome name="camera" size={wp('6%')} color="#45cca3" />
              <Text style={styles.uploadText}>Add Photos</Text>
            </TouchableOpacity>
            
            <ScrollView horizontal style={styles.imagePreview}>
              {images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.previewImage} />
              ))}
            </ScrollView>
          </View>

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter post description"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  scrollContainer: {
    paddingBottom: hp('2%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: wp('4%'),
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
    marginTop: hp('2%'),
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    fontSize: wp('4%'),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
  },
  statusButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: '#eee',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: wp('1%'),
  },
  activeStatus: {
    backgroundColor: '#45cca3',
  },
  statusText: {
    color: '#333',
    fontSize: wp('3.5%'),
  },
  activeStatusText: {
    color: '#fff',
  },
  imageUploadContainer: {
    marginVertical: hp('1%'),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#45cca3',
  },
  uploadText: {
    color: '#45cca3',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
  imagePreview: {
    marginTop: hp('1%'),
  },
  previewImage: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
  },
  descriptionInput: {
    height: hp('15%'),
    textAlignVertical: 'top',
  },
});
