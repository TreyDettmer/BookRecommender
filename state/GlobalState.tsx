import { createGlobalState } from 'react-hooks-global-state';
import { BookProps } from '../components/Book/Book';
import { createContext} from 'react';

export const LibraryContext = createContext({
    myLibrary: [] as BookProps[]
})
