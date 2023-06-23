import { StyleSheet, Text, View, FlatList } from 'react-native';
import Book, { BookProps } from '../../components/Book/Book';
import { useEffect, useState } from 'react';
import { FetchBooksByOtherBooksSubjects, FetchBooksByTitle } from '../../services/BookSearchService';
import { ActivityIndicator } from 'react-native';

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
      paddingVertical: 5
    },
    searchResults: {
      alignItems: 'center'
    }
});

const URL = "https://www.googleapis.com/books/v1/volumes?q=davinci";

const RecommendationsPage : any = ({getMySubjects, getMyLibrary,updateMyLibrary} : any) =>
{


    const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    // the books that have been used to generate recommendations paired with their associated recommendations
    const [existingRecommendationBase, setExistingRecommendationBase] = useState<any>({});

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

    const onBookSelected = (bookProps : BookProps) =>
    {
        alert(bookProps.title + " was selected");
    }
    useEffect(() => 
    {
        const fetchData = async () =>
        {            

            let myLibrary : BookProps[] = JSON.parse(JSON.stringify(getMyLibrary()));
            let copyOfExistingRecommendationBase = JSON.parse(JSON.stringify(existingRecommendationBase));
            let existingRecommendationBaseKeys = Object.keys(existingRecommendationBase);
            let copyOfRecommendedBooks : BookProps[] = JSON.parse(JSON.stringify(recommendedBooks));
            //console.warn(copyOfExistingRecommendationBase);
            for (let i = myLibrary.length - 1; i >= 0; i--)
            {
              let libraryBook = myLibrary[i];
              // check if we have already generated recommendations for this book
              if (copyOfExistingRecommendationBase[libraryBook.workKey] !== undefined)
              {
                // we don't need to consider this book for recommendations since we already have
                // so remove it from the books we will use to generate new recommendations
                myLibrary.splice(i,1);
                let indexOfBookKeyAsKey = existingRecommendationBaseKeys.indexOf(libraryBook.workKey);
                if (indexOfBookKeyAsKey >= 0)
                {
                  existingRecommendationBaseKeys.splice(indexOfBookKeyAsKey,1);
                }
              }
            }
            //console.warn(existingRecommendationBaseKeys);
            // remove recommendations based on books which have been removed from our library since last recommendation query
            for (let i = existingRecommendationBaseKeys.length - 1; i >= 0; i--)
            {
              let recommendedBooksToRemove : BookProps[] = copyOfExistingRecommendationBase[existingRecommendationBaseKeys[i]];
              //console.warn(`Removing books recommended from: ${existingRecommendationBaseKeys[i]}`);
              for (let j = recommendedBooksToRemove.length - 1; j >= 0; j--)
              {
                let indexOfBookToRemove = copyOfRecommendedBooks.findIndex((book : BookProps) => book.workKey == recommendedBooksToRemove[j].workKey);

                if (indexOfBookToRemove != -1)
                {
                  //console.warn(`removing book: ${recommendedBooksToRemove[j].title} at index ${indexOfBookToRemove}`);
                  copyOfRecommendedBooks.splice(indexOfBookToRemove,1);
                  //console.warn(copyOfRecommendedBooks);
                }
                else
                {
                  //console.warn(`Cant remove ${recommendedBooksToRemove[j].title} because index is -1`);
                }
              }

              // remove the key of the book which has been removed from our library
              
              delete copyOfExistingRecommendationBase[existingRecommendationBaseKeys[i]];
            }
            //console.warn("After removal");
            //console.warn(copyOfRecommendedBooks);


            // array of subjects associated with each new book
            let subjects : string[][] = [];
            for (let i = 0; i < myLibrary.length; i++)
            {
              let book : BookProps = myLibrary[i];
              if (book.categories !== undefined)
              {
                subjects.push(book.categories);
              }
            }
            if (subjects.length > 0)
            {
              let recommendationsForNewBooks : BookProps[][] = await FetchBooksByOtherBooksSubjects(subjects);
              if (recommendationsForNewBooks.length != myLibrary.length)
              {
                // console.warn(recommendationsForNewBooks);
                // console.warn(myLibrary);
                // console.warn("lengths are different");
                setIsSearching(false);
                return;
              }
              for (let i = 0; i < recommendationsForNewBooks.length; i++)
              {
                let recommendationsBasedOffBook = recommendationsForNewBooks[i];
                for (let n = recommendationsBasedOffBook.length - 1; n >= 0; n--)
                {
                  if (recommendationsBasedOffBook[n].workKey == myLibrary[i].workKey)
                  {
                    recommendationsBasedOffBook.splice(n,1);
                  }
                }
                copyOfExistingRecommendationBase[myLibrary[i].workKey] = recommendationsBasedOffBook;
                for (let j = 0; j < recommendationsBasedOffBook.length; j++)
                {
                  copyOfRecommendedBooks.push(recommendationsBasedOffBook[j]);
                }


              }
              copyOfRecommendedBooks = shuffle(copyOfRecommendedBooks);

            }
            setExistingRecommendationBase(copyOfExistingRecommendationBase);
              
            setRecommendedBooks(copyOfRecommendedBooks);
            setIsSearching(false);
        }
        setIsSearching(true);
        fetchData();
    }, [getMyLibrary()]);
    return (
    <View style={styles.container}>
      {recommendedBooks.length != 0 ? <Text style={styles.resultsInfo}>{recommendedBooks.length} results</Text> : null}
      {isSearching ? <ActivityIndicator size="large"/> : null}
      
      {!isSearching ?
        <FlatList
          data={recommendedBooks}
          renderItem={({item}) => <Book title={item.title} author={item.author} image={item.image} workKey={item.workKey} categories={item.categories}></Book>}
          contentContainerStyle={styles.searchResults}
        />
        : null
      }

    </View>
    );
}
export default RecommendationsPage;

