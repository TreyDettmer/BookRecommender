import { StyleSheet, Image, Text,View, TouchableHighlight, ScrollView} from 'react-native';

const styles = StyleSheet.create({
    container: {
      marginBottom: 50,
      fontSize: 18,
      height: 144,
      width: 328,
    //   backgroundColor: "#787171",
      display: 'flex',
      flexDirection: 'row'
      
    },
    imageContainer: {
        width: 84,
        marginLeft: 10,
        display: 'flex',
        justifyContent: 'center'
        

    },
    image: {
        // flex: 1,
        width: undefined,
        height: 115,
    },
    textualInfo : {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        flexGrow: 1,
        //backgroundColor: 'blue',
        padding: 10
    },

    titleContainer: {
        //flexGrow: 1
    },
    title: {
        fontSize: 20,
        color: 'black',
        overflow: 'scroll'
        
    },
    authorContainer: {
        //flexGrow: 1
    },
    author: {
        fontSize: 16,
        color: '#252525'
    },
    categoriesContainer: {
        display: 'flex',
        
    },
    categoriesContainer2: {
        //display: 'flex',
        
        
    },
    category: {
        marginRight: 5,
        borderRadius: 5,
        borderColor: "grey",
        borderWidth: 1,
        padding: 1,
        
        overflow: "scroll"
        
    },
    categoryText: {
        color: "black"
    },

    noCategoriesText: {
        color: "#8f0a00"
    }

});
export type BookProps = {
    title: string,
    author: string,
    image : string,
    workKey: string,
    categories? : string[],
    onSelect? : (bookProps : BookProps) => any
}

interface CategoriesProps
{
    categories : string[] | undefined;
}

const Categories : any = ({categories} : CategoriesProps) =>
{
    if (categories === undefined)
    {
        return null;
    }
    return (
        <View style={styles.categoriesContainer} >
            <ScrollView contentContainerStyle={styles.categoriesContainer2} horizontal={true}>
            {
                categories.map((category : string,index) =>
                (
                    <View style={styles.category} key={index}>
                        <Text style={styles.categoryText}>{category}</Text>
                    </View>
                    
                ))
            }
            </ScrollView>
        </View>
    );
}

const Book : any = (props : BookProps) =>
{
    return (

            <View style={styles.container}>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={"transparent"}
                    onPress={() => props.onSelect ? props.onSelect(props) : null}
                >
                    <View style={styles.imageContainer}>
                        <Image style={styles.image}
                        source={{uri: props.image}}
                        ></Image>
                    </View>
                </TouchableHighlight>
                <View style={styles.textualInfo}>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor={"transparent"}
                        onPress={() => props.onSelect ? props.onSelect(props) : null}
                    >
                        <View>
                            <View style={styles.titleContainer}>
                                <Text numberOfLines={2} style={styles.title}>{props.title}</Text>
                            </View>
                            <View style={styles.authorContainer}>
                                <Text style={styles.author}>by {props.author}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    
                    {!(props.categories == undefined || props.categories.length == 0) ? <Categories categories={props.categories} /> 
                    : <Text style={styles.noCategoriesText}>No Subjects</Text>
                    }
                    
                    
                </View>
            </View>
        
    );
}
export default Book;