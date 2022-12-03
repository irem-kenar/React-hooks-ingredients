import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};
// this is a hook now
// const httpReducer = (curHttpState, action) => {
//   switch (action.type) {
//     case 'SEND':
//       return { loading: true, error: null };
//     case 'RESPONSE':
//       return { ...curHttpState, loading: false };
//     case 'ERROR':
//       return { loading: false, error: action.errorMessage };
//     case 'CLEAR':
//       return { ...curHttpState, error: null };
//     default:
//       throw new Error('Should not be reached!');
//   }
// };

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifer
  } = useHttp();

  // this is a hook now
  // const [httpState, dispatchHttp] = useReducer(httpReducer, {
  //   loading: false,
  //   error: null
  // });

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();


  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
      });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-update-26a09-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
    //setIsLoading(true);
    // this is a hook now
    //dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hooks-update-26a09-default-rtdb.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   //setIsLoading(false);
    //   dispatchHttp({ type: 'RESPONSE' });
    //   return response.json();
    // }).then(responseData => {
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients,
    //   //   { id: responseData.name, ...ingredient }
    //   // ]);
    //   dispatch({
    //     type: 'ADD',
    //     ingredient: { id: responseData.name, ...ingredient }
    //   });
    // })
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    //setIsLoading(true);
    sendRequest(
      `https://react-hooks-update-26a09-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
  },
    // dispatchHttp({ type: 'SEND' });
    // fetch(`https://react-hooks-update-26a09-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
    //   method: 'DELETE',
    // }).then(response => {
    //   //setIsLoading(false);
    //   dispatchHttp({ type: 'RESPONSE' });
    //   // setUserIngredients(prevIngredients =>
    //   //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    //   // )
    //   dispatch({ type: 'DELETE', id: ingredientId });
    // }).catch(error => {
    //   dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
    //   // setError(error.message)
    //   // setError('Something went wrong');
    //   // setIsLoading(false)

    // });
    [sendRequest]);

  const clearError = useCallback(() => {
    //dispatchHttp({ type: 'CLEAR' });
    //setError(null);
  }, [])

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
