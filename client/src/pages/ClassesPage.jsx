import { useEffect, useState } from "react";
import { getClasses } from "../api";
import { useNavigate } from "react-router-dom";
import BulkImportModal from "../components/BulkImportModal";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [importClass, setImportClass] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  function openImportModal(cls) {
    setImportClass(cls);
  }

  return (
    <div
      className="
        sm:p-6 
        p-4      /* Mobile padding */
      "
    >
      <h1 className="text-3xl font-bold mb-6">Classes</h1>

      {/* Grid responsive layout */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-6
      ">
        {classes.map((cls) => (
          <div
            key={cls._id}
            className="
              glass-panel 
              rounded-lg 
              shadow-sm 
              hover:shadow 
              transition

              /* Mobile padding fix */
              sm:p-6 
              p-4
            "
          >
            <p className="text-xl font-semibold text-blue-400">{cls.name}</p>
            <p className="text-gray-400 text-sm mt-1">Year: {cls.year ?? "-"}</p>

            <div className="flex justify-between mt-5 gap-3">
              <button
                className="btn-glow flex-1 text-center"
                onClick={() =>
                  navigate(`/attendance?classId=${cls._id}`)
                }
              >
                Open Attendance
              </button>

              <button
                className="btn-danger flex-1 text-center"
                onClick={() => openImportModal(cls)}
              >
                Import Students
              </button>
            </div>
          </div>
        ))}
      </div>

      {importClass && (
        <BulkImportModal
          classObj={importClass}
          onClose={() => setImportClass(null)}
        />
      )}
    </div>
  );
}
