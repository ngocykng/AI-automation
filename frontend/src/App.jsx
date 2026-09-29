import {
    Routes,
    Route
} from "react-router-dom";

import MainLayout from "./page/MainLayout";
// import WorkflowEditorPage from "./page/WorkflowEditorPage";
import HomePage from "./page/HomePage";
import WorkflowPage from "./page/WorkflowPage";
import Loginpage from "./page/Loginpage";
import Registerpage from "./page/Registerpage";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/workflow"
                    element={<HomePage />}
                />
                <Route path="/workflow/:id" element={<WorkflowPage />} />
                <Route path="/login" element={<Loginpage />} />
                <Route path="/register" element={<Registerpage />} />

            </Route>
        </Routes>
    );
}

export default App;