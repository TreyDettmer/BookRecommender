import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { useState } from 'react';
import Book, { BookProps } from '../../components/Book/Book';
import { FetchBooksByTitle } from '../../services/BookSearchService';
import { ActivityIndicator } from 'react-native';

const AddBookPage : any = ({getMyLibrary,updateMyLibrary} : any) =>
{
    const [search, setSearch] = useState<string>("");
    const [finalSearch, setFinalSearch] = useState<string>("");
    const [booksData, setBooksData] = useState<any[]>([]);
    const [searchResultsInfo, setSearchResultsInfo] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const updateSearch = (search : string) =>
    {
        setSearch(search)
    }
    const onBookSelected = (bookProps : BookProps) =>
    {
        

        let library : BookProps[] = getMyLibrary();
        if (library.length >= 15)
        {
            alert(`My Books has reached its book limit.`);
            return;
        }
        if (library.findIndex((book : BookProps) => book.workKey === bookProps.workKey) >= 0)
        {
            
            alert(`'${bookProps.title}' already exists in My Books`);
            return;
        }
        let newMyLibrary = [ ...library,bookProps]
        updateMyLibrary(newMyLibrary);
        alert(`'${bookProps.title}' added to My Books`);
        let indexInSearchResults = booksData.findIndex((book : BookProps) => book.workKey === bookProps.workKey);
        if (indexInSearchResults >= 0)
        {
            
            let booksDataCopy = JSON.parse(JSON.stringify(booksData));
            booksDataCopy.splice(indexInSearchResults,1);
            setBooksData(booksDataCopy);
        }

    }
    const onSubmit = async () =>
    {
        setFinalSearch(search);
        setSearchResultsInfo("");
        setIsSearching(true);
        let books : any[] = await FetchBooksByTitle(search);
        setIsSearching(false);
        setSearchResultsInfo(`${books.length} results for "${search}"`)
        setBooksData(books);
    }
    return (
        <View style={styles.container}>
            <SearchBar
                style={styles.searchBar}
                placeholder="Enter Book Title..."
                onChangeText={updateSearch}
                value={search}
                onSubmitEditing={()=>onSubmit()}
            ></SearchBar>
            {finalSearch != "" ? <Text style={styles.resultsInfo}>{searchResultsInfo}</Text> : null}
            {isSearching ? <ActivityIndicator size="large"/> : null}
            {   !isSearching ?
                <FlatList
                    data={booksData}
                    renderItem={({item}) => <Book title={item.title} author={item.author} image={item.image} workKey={item.workKey} onSelect={onBookSelected} categories={item.categories}></Book>}
                    contentContainerStyle={styles.searchResults}
                />
                : null
            }

        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 5,

      backgroundColor: "#fcfcfc",
      width: undefined,
      height: undefined
    },
    searchBar: {
        width:  '100%',
        height: 50,       
    },
    resultsInfo: {
        paddingLeft: 24,
        paddingVertical: 5
    },
    searchResults: {
        alignItems: 'center'
    }
});
export default AddBookPage;