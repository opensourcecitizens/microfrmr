import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getPosts, loadPosts, subscribe } from '../appData/postsStore';

export default function DetailsScreen() {
  const navigation = useNavigation();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [shares, setShares] = useState({});
  const [views, setViews] = useState({});
  const [posts, setPosts] = useState(getPosts());

  const handleLike = (postId) =>
    setLikes({ ...likes, [postId]: (likes[postId] || 0) + 1 });
  const handleShare = (postId) =>
    setShares({ ...shares, [postId]: (shares[postId] || 0) + 1 });
  const handleView = (postId) =>
    setViews({ ...views, [postId]: (views[postId] || 0) + 1 });

  const handlePostComment = (postId) => {
    if (comment) {
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), comment],
      }));
      setComment('');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribe(() => setPosts(getPosts()));
    loadPosts().catch(() => null);
    return unsubscribe;
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={typeof item.profileImage === 'string' && item.profileImage.startsWith('http') ? { uri: item.profileImage } : { uri: 'https://placehold.co/300x300/png' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <View style={styles.profileHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.farmName}>{item.farmName || item.storeName}</Text>
              <Text style={styles.farmAddress}>{item.farmAddress || item.storeAddress}</Text>
              <Text style={styles.farmDetails}>{item.farmDetails || item.storeDetails}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('FarmProfileSettings', { post: item })}>
              <Feather name="settings" size={wp('5.5%')} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.statusTextInHeader}>Status: {item.status}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {(item.images || []).map((imageUri, index) => (
          <Image
            key={index}
            source={typeof imageUri === 'string' && imageUri.startsWith('http') ? { uri: imageUri } : { uri: 'https://placehold.co/800x600/png' }}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>

      <View style={styles.iconSection}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleLike(item.id)}>
          <Feather name="thumbs-up" size={wp('6%')} color="#45cca3" />
          <Text style={styles.iconText}>{likes[item.id] || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <Feather name="message-square" size={wp('6%')} color="#45cca3" />
          <Text style={styles.iconText}>{(comments[item.id] || []).length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(item.id)}>
          <Feather name="share-2" size={wp('6%')} color="#45cca3" />
          <Text style={styles.iconText}>{shares[item.id] || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <FontAwesome name="download" size={wp('6%')} color="#45cca3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleView(item.id)}>
          <Feather name="eye" size={wp('6%')} color="#45cca3" />
          <Text style={styles.iconText}>{views[item.id] || 0}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.descriptionText}>
        {item.description}
        <Text style={styles.showMore}> show more</Text>
      </Text>

      <View style={styles.commentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          placeholderTextColor="grey"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.commentButton} onPress={() => handlePostComment(item.id)}>
          <Feather name="send" size={wp('6%')} color="#45cca3" />
        </TouchableOpacity>
      </View>

      {(comments[item.id] || []).map((c, index) => (
        <Text key={index} style={styles.commentText}>
          {c}
        </Text>
      ))}
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyState}>No live posts yet. Create one to see it here.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    marginBottom: hp('2%'),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45cca3',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
  },
  profileImage: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('4%'),
    marginRight: wp('4%'),
  },
  profileInfo: {
    flex: 1,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: wp('2%'),
  },
  farmName: {
    fontSize: wp('4.5%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  farmAddress: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
  },
  farmDetails: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
  },
  statusTextInHeader: {
    fontSize: wp('4%'),
    color: '#fff',
    fontWeight: 'bold',
    marginTop: hp('1%'),
  },
  carousel: {
    height: hp('55%'),
  },
  carouselImage: {
    width: wp('100%'),
    height: hp('55%'),
  },
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('1%'),
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: '#45cca3',
    marginLeft: wp('1%'),
  },
  descriptionText: {
    fontSize: wp('3.5%'),
    color: '#000000',
    paddingHorizontal: wp('5%'),
    marginVertical: hp('1%'),
  },
  showMore: {
    color: '#45cca3',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2%'),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: '#45cca3',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    marginRight: wp('2%'),
  },
  commentButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  commentText: {
    fontSize: wp('3.5%'),
    color: '#333',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('0.5%'),
  },
  emptyState: {
    padding: wp('5%'),
    textAlign: 'center',
    color: '#666'
  },
});
