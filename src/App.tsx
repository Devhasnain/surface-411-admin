import { BrowserRouter as Router, Routes, Route } from "react-router";

import TermsAndConditions from "./pages/OtherPage/TermsAndConditions";
import DownloadMineral from "./pages/MineralList/DownloadMineral";
import MineralDetail from "./pages/MineralList/MineralDetail";
import ForgetPassword from "./pages/AuthPages/ForgetPassword";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PrivacyPolicy from "./pages/OtherPage/PrivacyPolicy";
import EditMineral from "./pages/MineralList/EditMineral";
import AddMineral from "./pages/MineralList/AddMineral";
import UserDetails from "./pages/Users/UserDetails";
import AddEditPlan from "./pages/Plans/AddEditPlan";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import SignIn from "./pages/AuthPages/SignIn";
import NewsLetters from "./pages/NewsLetters";
import MineralList from "./pages/MineralList";
import AppLayout from "./layout/AppLayout";
import { AuthManager } from "./components";
import Locations from "./pages/Locations";
import Home from "./pages/Dashboard/Home";
import Faqs from "./pages/OtherPage/Faqs";
import Customers from "./pages/Customers";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
import Plans from "./pages/Plans";


export default function App() {
  return (
    <>
      <Router>
        <AuthManager />
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/users" element={<Users />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />}/>
            <Route path="/newsletters" element={<NewsLetters />} />
            <Route path="/mineral" element={<MineralList />} />
            <Route path="/mineral/:id" element={<MineralDetail />} />
            <Route path="/add-mineral" element={<AddMineral />} />
            <Route path="/download-mineral" element={<DownloadMineral />} />
            <Route path="/edit-mineral/:id" element={<EditMineral />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/plans/create" element={<AddEditPlan />} />
            <Route path="/plans/:id" element={<AddEditPlan />} />

          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
