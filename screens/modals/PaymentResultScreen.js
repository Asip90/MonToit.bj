import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const TestScreen = ({ route, navigation }) => {
  // Récupération des paramètres de navigation
  const { reservationId, paymentStatus, paymentUrl } = route.params || {};
  
  // États pour la simulation
  const [deepLinkUrl, setDeepLinkUrl] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testLogs, setTestLogs] = useState([]);
  const [manualUrl, setManualUrl] = useState('');
  
  // Initialisation avec les données du paiement
  useEffect(() => {
    if (paymentUrl) {
      setManualUrl(paymentUrl);
      addLog(`URL de paiement reçue: ${paymentUrl}`);
    }
    
    if (paymentStatus) {
      addLog(`Statut de paiement initial: ${paymentStatus}`);
    }
    
    if (reservationId) {
      addLog(`ID de réservation: ${reservationId}`);
    }
    
    // Générer un lien de test par défaut
    const defaultLink = `montoitbj://payment/return/${reservationId || 'test123'}?status=success`;
    setDeepLinkUrl(defaultLink);
    setManualUrl(defaultLink);
  }, []);

  // Ajouter un message de log
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Tester un deep link manuellement
  const testDeepLink = async () => {
    try {
      addLog(`Tentative d'ouverture: ${deepLinkUrl}`);
      
      // Validation basique
      if (!deepLinkUrl) {
        addLog('❌ Erreur: URL vide');
        return;
      }
      
      // Ouvrir le lien
      const supported = await Linking.canOpenURL(deepLinkUrl);
      
      if (supported) {
        await Linking.openURL(deepLinkUrl);
        addLog('✅ Lien ouvert avec succès');
      } else {
        addLog(`❌ Impossible d'ouvrir l'URL: ${deepLinkUrl}`);
      }
    } catch (error) {
      addLog(`🚨 Erreur: ${error.message}`);
    }
  };

  // Simuler un paiement
  const simulatePayment = async () => {
    addLog('Lancement de la simulation de paiement...');
    
    try {
      if (!manualUrl) {
        addLog('❌ URL de paiement manquante');
        return;
      }
      
      // Ouvrir le navigateur avec l'URL de paiement
      addLog(`Ouverture du navigateur: ${manualUrl}`);
      await WebBrowser.openBrowserAsync(manualUrl, {
        toolbarColor: '#2bb673',
        controlsColor: 'white'
      });
      
      addLog('Navigateur ouvert - attente de redirection...');
    } catch (error) {
      addLog(`🚨 Erreur: ${error.message}`);
    }
  };

  // Tester la réception d'un deep link
  const testDeepLinkReception = () => {
    addLog('Test de réception de deep link...');
    
    // Simuler la réception d'un deep link
    const testUrl = deepLinkUrl || 'montoitbj://payment/return/test123?status=success';
    Linking.emit('url', { url: testUrl });
    
    addLog(`Événement "url" émis: ${testUrl}`);
  };

  // Tester avec des données prédéfinies
  const runTestScenario = (status) => {
    const id = reservationId || 'test_' + Math.random().toString(36).substr(2, 5);
    const testUrl = `montoitbj://payment/return/${id}?status=${status}`;
    
    setDeepLinkUrl(testUrl);
    addLog(`Scénario configuré: ${status}`);
    addLog(`URL générée: ${testUrl}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Écran de Test</Text>
      
      {/* Section de simulation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simulation de Paiement</Text>
        
        <TextInput
          style={styles.input}
          value={manualUrl}
          onChangeText={setManualUrl}
          placeholder="URL de paiement"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={simulatePayment}
        >
          <Text style={styles.buttonText}>Tester le Flux Complet</Text>
        </TouchableOpacity>
      </View>
      
      {/* Section deep link */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test de Deep Links</Text>
        
        <TextInput
          style={styles.input}
          value={deepLinkUrl}
          onChangeText={setDeepLinkUrl}
          placeholder="montoitbj://payment/return/..."
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.smallButton]} 
            onPress={testDeepLink}
          >
            <Text style={styles.buttonText}>Ouvrir le Lien</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.smallButton]} 
            onPress={testDeepLinkReception}
          >
            <Text style={styles.buttonText}>Simuler Réception</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.scenarioRow}>
          <Text>Scénarios:</Text>
          <TouchableOpacity 
            style={[styles.scenarioButton, styles.successButton]} 
            onPress={() => runTestScenario('success')}
          >
            <Text style={styles.scenarioButtonText}>Succès</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.scenarioButton, styles.errorButton]} 
            onPress={() => runTestScenario('failed')}
          >
            <Text style={styles.scenarioButtonText}>Échec</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.scenarioButton, styles.warningButton]} 
            onPress={() => runTestScenario('canceled')}
          >
            <Text style={styles.scenarioButtonText}>Annulé</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Section résultats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Journal de Test</Text>
        
        <View style={styles.logsContainer}>
          {testLogs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={() => setTestLogs([])}
        >
          <Text style={styles.buttonText}>Effacer les Logs</Text>
        </TouchableOpacity>
      </View>
      
      {/* Données reçues */}
      {reservationId && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Données Reçues</Text>
          <Text>Reservation ID: {reservationId}</Text>
          <Text>Statut: {paymentStatus || 'non défini'}</Text>
          <Text>URL: {paymentUrl || 'non fournie'}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2bb673',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
  },
  scenarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  scenarioButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  errorButton: {
    backgroundColor: '#dc3545',
  },
  warningButton: {
    backgroundColor: '#ffc107',
  },
  scenarioButtonText: {
    color: 'white',
    fontSize: 12,
  },
  logsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  infoBox: {
    backgroundColor: '#e9f5e9',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#28a745',
  },
});

export default TestScreen;