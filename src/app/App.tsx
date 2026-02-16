import './styles/App.css'
import {useAppDispatch, useAppSelector} from "./providers";
import {useEffect} from "react";
import {fetchRequestsThunk} from "../entities/request/model/thunks.ts";

function App() {


    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector((state) => state.requests);

    useEffect(() => {
        dispatch(fetchRequestsThunk());
    }, [dispatch]);

    if (isLoading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
      <div className="p-6">
          <div className="font-bold mb-4">Requests: {items.length}</div>
          <pre className="bg-white p-4 rounded-xl shadow">{JSON.stringify(items, null, 2)}</pre>
      </div>
  )
}

export default App
