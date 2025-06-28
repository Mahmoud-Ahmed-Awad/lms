import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/students/Loading";
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Navbar from "./components/students/Navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import EditCourse from "./pages/educator/EditCourse";
import EducatorCourses from "./pages/student/EducatorCourses";
import EducatorsList from "./pages/student/EducatorsList";
import CategoryList from "./pages/student/CategoryList";

function App() {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/educator-list" element={<EducatorsList />} />
        <Route path="/educator-list/:input" element={<EducatorsList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/category-list/:educatorId" element={<CategoryList />} />
        <Route
          path="/category-course-list/:category"
          element={<CoursesList />}
        />
        <Route
          path="/category-course-list/:category/:input"
          element={<CoursesList />}
        />
        <Route
          path="/category-list/:educatorId/:input"
          element={<CategoryList />}
        />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route
          path="/educator-courses/:educatorId"
          element={<EducatorCourses />}
        />
        <Route
          path="/educator-courses/:educatorId/:input"
          element={<EducatorCourses />}
        />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/Loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
          <Route path="edit-course/:courseId" element={<EditCourse />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
