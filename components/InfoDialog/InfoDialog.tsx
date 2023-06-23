
import { Dialog } from '@rneui/themed';
import { StyleSheet, Linking, Text,View, TouchableHighlight, TouchableOpacity, ScrollView} from 'react-native';


const styles = StyleSheet.create({
    container:
    {
        //height: '80%',
        paddingTop: 2,
        //alignItems: "center",
        margin: 0
        
        
    },

    dialog:
    {
        backgroundColor: "pink",
        //justifyContent: 'center'
        
    },
    test:
    {
        backgroundColor: "blue",
    },
    test2:
    {
        
    },
    title:
    {
        fontSize: 20,
        fontWeight:'bold',
        textDecorationLine:'underline',
        width: '100%',
        textAlign: 'center'
    },

    pageTitle:
    {
        fontSize: 15,
        fontWeight: 'bold'
    },

    author:
    {
        fontSize: 15,
        width: '100%',
        paddingVertical: 5,
        textAlign: 'center'

    },
    heading:
    {
        fontSize: 20,
        fontWeight:'bold',

        width: '100%',
        paddingTop: 5
    },
    bodyText:
    {
        fontSize: 15,
    },
});

const InfoDialog : any = (props : any) =>
{
    return (
        <Dialog
            isVisible={props.isVisible}
            onBackdropPress={() => props.SetIsVisible(false)}
            
        >
            <ScrollView style={styles.container}>               
                {/* <Dialog.Title titleStyle={styles.test} title="Dialog Title"/> */}
                <Text style={styles.title}>Book Recommender</Text>
                <Text style={styles.author}>Created by Trey Dettmer</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                    <Text style={styles.heading}>How It Works</Text>
                    <Text style={styles.bodyText}>
                        Search for a book you have read in the
                        <Text style={styles.pageTitle}>
                        {" "}Add Books{" "} 
                        </Text>
                         page. Select a 
                        book to add it to your 
                        <Text style={styles.pageTitle}>
                        {" "}My Books{" "} 
                        </Text>
                        page. The 
                        <Text style={styles.pageTitle}>
                        {" "}Recommendations{" "} 
                        </Text> 
                        page shows
                        book recommendations based on the subjects of the books in your
                        <Text style={styles.pageTitle}>
                        {" "}My Books{" "} 
                        </Text>
                        page. If a book has                      
                        <Text style={{fontSize: 15, color: "#8f0a00"}}>
                        {" "}No Subjects
                        </Text>
                        , then it will not generate any recommendations. Selecting a book in your
                        <Text style={styles.pageTitle}>
                        {" "}My Books{" "} 
                        </Text>
                        page will remove it and its associated recommendations.
                    </Text>
                    
                    <Text style={styles.heading}>Acknowledgements</Text>
                    <Text style={styles.bodyText}>
                        The books are fetched using 
                    </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://openlibrary.org/developers/api')}>
                        <Text style={{color: 'blue'}}>
                        https://openlibrary.org/developers/api
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.heading}>Other Info</Text>
                    <Text style={styles.bodyText}>
                        This is my first app built with React Native and published using Expo. 
                    </Text>
                </View>
            </ScrollView>
        </Dialog>
    );
}
export default InfoDialog;