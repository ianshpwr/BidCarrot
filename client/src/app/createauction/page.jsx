import Stepr from '@/Components/CreateAuction/Steppr';
import ProtectedRoute from "@/Components/ProtectedRoute";

function CreateAuction() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-36 pb-12 px-4">
        <Stepr/>
      </div>
    </ProtectedRoute>
  );
}
export default CreateAuction;