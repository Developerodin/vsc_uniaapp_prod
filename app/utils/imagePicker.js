import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const requestImagePickerPermissions = async () => {
  try {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access camera roll was denied');
      }
      return true;
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access camera roll was denied');
      }
      return true;
    }
  } catch (error) {
    console.error('Permission request failed:', error);
    throw error;
  }
};

export const pickImageFromLibrary = async (options = {}) => {
  try {
    // Request permissions first
    await requestImagePickerPermissions();

    const defaultOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reduced quality to prevent memory issues
      allowsMultipleSelection: false,
      ...options
    };

    const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

    if (result.canceled) {
      return null;
    }

    // For iOS, ensure we have a valid URI
    if (Platform.OS === 'ios' && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      
      // Validate the URI
      if (!asset.uri) {
        throw new Error('Invalid image URI received');
      }

      // Check file size (iOS has memory limitations)
      if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Image file size too large. Please select a smaller image.');
      }

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
        type: asset.type || 'image/jpeg'
      };
    }

    return result.assets[0];
  } catch (error) {
    console.error('Image picker error:', error);
    throw error;
  }
};

export const takePhotoWithCamera = async (options = {}) => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied');
    }

    const defaultOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      ...options
    };

    const result = await ImagePicker.launchCameraAsync(defaultOptions);

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error('Camera error:', error);
    throw error;
  }
};

export const showImagePickerOptions = async (onSelectFromLibrary, onTakePhoto) => {
  try {
    // For now, just use the library picker as fallback
    // The dynamic import might be causing issues with the bundler
    onSelectFromLibrary();
  } catch (error) {
    console.error('Action sheet error:', error);
    // Fallback to library picker
    onSelectFromLibrary();
  }
};

export const validateImageFile = (imageUri, maxSizeMB = 10) => {
  return new Promise((resolve, reject) => {
    if (!imageUri) {
      reject(new Error('No image URI provided'));
      return;
    }

    // For iOS, we can't easily check file size without additional libraries
    // So we'll rely on the image picker's built-in validation
    resolve(true);
  });
};

export const compressImageForUpload = async (imageUri, quality = 0.8) => {
  try {
    // For now, we'll use the image picker's quality setting
    // In a production app, you might want to use a library like react-native-image-resizer
    return imageUri;
  } catch (error) {
    console.error('Image compression error:', error);
    return imageUri; // Return original if compression fails
  }
}; 