import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {FontAwesome}from '@expo/vector-icons/';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RecommendationsPage from './pages/Recommendations/Recommendations';
import LibraryPage from './pages/Library/Library';
import AddBookPage from './pages/AddBook/AddBook';
import { BookProps } from './components/Book/Book';
import { useEffect, useState } from 'react';
import { Button, Icon } from '@rneui/base';
import { IconButton } from '@react-native-material/core';
import InfoDialog from './components/InfoDialog/InfoDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function LogoTitle(props : any)
{

  const styles = StyleSheet.create({
    container:
    {
      backgroundColor: 'blue',
      width: undefined,
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
      
      
    }
  });
  return (
    <View style={styles.container}>
      <Image
        style={{ width: 35, height: 35 }}
        source={require('./assets/favicon.png')}
      />
      <Text>{props.title}</Text>
    </View>
  );
}


export default function App() {

  const [myLibrary, setMyLibrary]= useState<BookProps[]>([]);
  const [mySubjects, setMySubjects] = useState<string[]>([]);
  const [isHelpDialogVisible, setIsHelpDialogVisible] = useState<boolean>(false);
  const [hasLoadedLibraryData, setHasLoadedLibraryData] = useState<boolean>(false);

  const getMyLibrary = () =>
  {
    return myLibrary;
  }
  const getMySubjects = () =>
  {
    return mySubjects;
  }

  const updateHelpDialogVisibilty = (shouldBeVisible : boolean) =>
  {
    setIsHelpDialogVisible(!isHelpDialogVisible);
  }

  // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array : any) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  useEffect(() => 
  {
    if (!hasLoadedLibraryData)
    {
      loadStoredLibraryData();
      setHasLoadedLibraryData(true);
    }
  })

  const updateMyLibrary = (newLibrary : BookProps[]) =>
  {
    if (!hasLoadedLibraryData)
    {
      loadStoredLibraryData();
      setHasLoadedLibraryData(true);
    }
    let allCategories = [];
    for (let i = 0; i < newLibrary.length; i++)
    {
      if (newLibrary[i].categories !== undefined)
      {
        allCategories.push(...newLibrary[i].categories!)
      }
    }
    allCategories  = [...new Set(allCategories)];
    allCategories = shuffle(allCategories);
    setMyLibrary(newLibrary);
    setMySubjects(allCategories);

    // store library data
    storeLibraryData(newLibrary);
    
  }

  const storeLibraryData = async (newLibraryData : BookProps[]) =>
  {
    try
    {
      const jsonValue = JSON.stringify(newLibraryData);
      await AsyncStorage.setItem('libraryData',jsonValue);
    }
    catch(error)
    {
      console.warn(error);
    }
  }

  const loadStoredLibraryData =async () => {

    try
    {
      const jsonValue = await AsyncStorage.getItem('libraryData');
      setMyLibrary(jsonValue != null ? JSON.parse(jsonValue) : []);
    }
    catch(error)
    {
      console.warn(error);
    }
    
    
  }


  return (
    <SafeAreaProvider>
      <InfoDialog isVisible={isHelpDialogVisible} SetIsVisible={updateHelpDialogVisibilty}></InfoDialog>
      <NavigationContainer>
        <Tab.Navigator
          
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName : any = "home";

              if (route.name === 'Recommendations') 
              {
                iconName = focused
                  ? 'home'
                  : 'home';
              } 
              else if (route.name === 'My Books') 
              {
                iconName = focused ? 'list' : 'list';
              }
              else if (route.name === 'Add Books')
              {
                iconName = focused ? 'plus' : 'plus';
              }
              // You can return any component that you like here!
              return (<FontAwesome name={iconName} size={size} color={color} />);
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false,
            tabBarItemStyle: {

              
            },
            tabBarStyle: {
              position: 'absolute',
              bottom: 25,
              left: 20,
              right: 20,
              elevation: 0,
              backgroundColor: "#e8b272",
              borderRadius: 60,
              height: 60, 
              paddingBottom: 0
              
            },

            headerStyle: {
              backgroundColor: '#fcfcfc'
            },
            headerRight: () => (
              <IconButton onPress={() => updateHelpDialogVisibilty(true)} icon={props => <FontAwesome name='question-circle-o' size={25} color={"black"}/>}/>
            ),
            headerLeft: () => (
              <Image
              style={{ width: 35, height: 35, marginLeft: 10 }}
              source={require('./assets/favicon.png')}
              />
            ),




            headerTitleAlign: 'center'
          })}
          initialRouteName="Add Books"
          
        >
          <Tab.Screen name="Recommendations" children={()=><RecommendationsPage getMySubjects={() => getMySubjects()} getMyLibrary={() => getMyLibrary()} updateMyLibrary={(newLibrary: BookProps[]) => updateMyLibrary(newLibrary)} />}/>
          <Tab.Screen name="My Books" children={()=><LibraryPage getMyLibrary={() => getMyLibrary()} updateMyLibrary={(newLibrary: BookProps[]) => updateMyLibrary(newLibrary)} />}/>
          <Tab.Screen name="Add Books" children={()=><AddBookPage getMyLibrary={() => getMyLibrary()} updateMyLibrary={(newLibrary: BookProps[]) => updateMyLibrary(newLibrary)} />}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    );
}


