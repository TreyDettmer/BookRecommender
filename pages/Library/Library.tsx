import { FlatList, StyleSheet, Text, View } from 'react-native';
import Book, { BookProps } from '../../components/Book/Book';

const LibraryPage : any = ({getMyLibrary,updateMyLibrary} : any) =>
{
    const myLibrary = getMyLibrary();
    const onBookSelected = (bookProps : BookProps) =>
    {
        let newMyLibrary = [...myLibrary];
        let bookIndex = newMyLibrary.findIndex(book => book.workKey == bookProps.workKey);
        if (bookIndex < 0)
        {
            return;
        }
        newMyLibrary.splice(bookIndex,1);
        updateMyLibrary(newMyLibrary);
        alert(bookProps.title + " removed from My Books");
    }
    
    return (

        <View style={styles.container}>
            {myLibrary && myLibrary.length >= 15 ? <Text style={styles.resultsInfo}>At maximum book capacity (15 books)</Text> : null}
        <FlatList
            data={myLibrary}
            renderItem={({item}) => <Book title={item.title} author={item.author} image={item.image} workKey={item.workKey} onSelect={onBookSelected} categories={item.categories}></Book>}
            contentContainerStyle={styles.bookList}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
      backgroundColor: "#fcfcfc",
      width: undefined,
      height: undefined
    },
    resultsInfo: {
        paddingLeft: 24,
        paddingVertical: 5,
        color:"#8f0a00"
    },
    bookList: {
        alignItems: 'center'
    }
});
export default LibraryPage;