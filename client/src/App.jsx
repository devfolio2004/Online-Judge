import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { fetchMe } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;