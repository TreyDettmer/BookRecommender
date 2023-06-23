import { BookProps } from "../components/Book/Book";
import axios from "axios";



const GetSubjectsFromBook = (book : any) =>
{
    let subjects : string[] = [];
    if (book.subject !== undefined)
    {
        if (book.subject.length > 0)
        {
            subjects = book.subject as string[];
            for (let i = subjects.length - 1; i >= 0; i--)
            {
                let englishLetters = /^[A-Za-z0-9 -_.!"'\/$]+$/;
                if (!englishLetters.test(subjects[i]))
                {
                    subjects.splice(i,1);
                    continue;
                }
                if (subjects[i].split(" ").length > 2)
                {
                    subjects.splice(i,1);
                    continue;
                }
                if (subjects[i].split("-").length > 2)
                {
                    subjects.splice(i,1);
                    continue;
                }

            }
            subjects.sort(function(a,b)
            {
                return a.length - b.length;
            })
            if (subjects.length > 15)
            {
                subjects = subjects.slice(0,15);
            }
        }
    }
    return subjects;
}


export const FetchBooksByTitle = async (title : string) : Promise<any[]> =>
{
    let URL = "https://openlibrary.org/search.json?q=" + title + "&languages=eng&limit=20";
    return axios.get(URL)
        .then((response) =>
        {
            if (response.data.docs === undefined || response.data.docs.length == 0)
            {
                return [];
            }
            let books : any[] = [];
            books = response.data.docs.map((book : any) =>
            {
                let author : string = "unknown";
                let title : string = "<No Title>";
                let image : string = "https://galapagos-pro.com/wp-content/uploads/2021/03/book-placeholder.jpg";
                let subjects : string[] = [];
                if (book.author_name !== undefined)
                {
                    if (book.author_name.length > 0)
                    {
                        author = book.author_name[0] as string;
                    }
                }
                if (book.title !== undefined)
                {
                    title = book.title as string;
                }
                subjects = GetSubjectsFromBook(book);
                
                if (book.cover_i !== undefined)
                {
                    image = `https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`;
                }
                let workKey = book.key as string;
                let bookProps : BookProps = 
                {
                    title: title,
                    author: author,
                    image: image,
                    workKey: workKey,
                    categories: subjects
                }
                return bookProps;
            })
            return books;
        })
        .catch((error) =>
        {
            console.warn(error);
            return [];
        })
}




export const FetchBooksByOtherBooksSubjects = async (booksSubjects : string[][]) : Promise<BookProps[][]> =>
{
    if (booksSubjects.length == 0)
    {
        return [];
    }

    let returnedBookArray : BookProps[][] = [];
    for (let myBookIndex = 0; myBookIndex < booksSubjects.length; myBookIndex++)
    {
        let bookSubjectList = booksSubjects[myBookIndex];
        if (bookSubjectList.length == 0)
        {
            returnedBookArray.push([]);
            continue;
        }
        // collect all of this book's subjects into a string
        let subjectString = "(" + `"${bookSubjectList[0]}"`;
        for (let i = 1; i < bookSubjectList.length; i++)
        {
            let encodedURLLength = encodeURI(subjectString).length + encodeURI("https://openlibrary.org/search.json?q=subject:&limit=20&language:eng").length;
            if (encodedURLLength + encodeURI(bookSubjectList[i]).length > 4093)
            {
                subjectString += ")";
                break;
            }
            if (i != bookSubjectList.length - 1)
            {
                subjectString += ` OR "${bookSubjectList[i]}"`;
            }
            else
            {
                subjectString += ` OR "${bookSubjectList[i]}")`;
            }
        }

        let URL = "https://openlibrary.org/search.json?q=subject:" + subjectString + "&language:eng&limit=8";
        await axios.get(URL)
        .then((response) =>
        {
            if (response.data.docs === undefined || response.data.docs.length == 0)
            {
                console.warn(response);
                alert("There was an error fetching recommendations");
                return [];
            }
            let books : BookProps[] = [];
            books = response.data.docs.map((book : any) =>
            {
                let author : string = "unknown";
                let title : string = "<No Title>";
                let image : string = "https://galapagos-pro.com/wp-content/uploads/2021/03/book-placeholder.jpg";
                let subjects : string[] = [];
                if (book.author_name !== undefined)
                {
                    if (book.author_name.length > 0)
                    {
                        author = book.author_name[0] as string;
                    }
                }
                if (book.title !== undefined)
                {
                    title = book.title as string;
                    if (book.subtitle !== undefined)
                    {
                        title += `:${book.subtitle}`;
                    }
                }
                subjects = GetSubjectsFromBook(book);
                if (book.cover_i !== undefined)
                {
                    image = `https://covers.openlibrary.org/b/ID/${book.cover_i}-M.jpg`;
                    
                }
                let workKey = book.key as string;
                let bookProps : BookProps = 
                {
                    title: title,
                    author: author,
                    image: image,
                    workKey: workKey,
                    categories: subjects
                }
                return bookProps;
            })
            returnedBookArray.push(books);
        })
        .catch((error) =>
        {
            alert("There was an error fetching recommendations");
            console.warn(error);
        })
    }
    return returnedBookArray;
}

