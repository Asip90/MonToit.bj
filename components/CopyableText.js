import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';

const CopyableText = ({ text, children, style }) => {
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = () => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TouchableOpacity 
      onPress={copyToClipboard} 
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      {children || <Text style={styles.text}>{text}</Text>}
      <MaterialIcons 
        name={copied ? 'check' : 'content-copy'} 
        size={18} 
        color={copied ? 'green' : 'gray'} 
        style={styles.icon} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  text: {
    marginRight: 8,
  },
  icon: {
    marginLeft: 4,
  },
});

export default CopyableText;