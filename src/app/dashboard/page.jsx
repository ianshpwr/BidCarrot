import Footer from "@/Components/Landingpage/Footer";
import './dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome back! Here's your auction activity</h1>
    <div className="databar">
      <div className="databarli">Active Bids</div>
      <div className="databarli">Total Spent</div>
      <div className="databarli">Auctions Won</div>
      <div className="databarli">Success Rate</div>
    </div>

    <div className="datacontainer">
    <div className="data">
      <h2>Active Auctions</h2>

      <div className="datacontainerli">
        <div className="liss"><h3>Auction Name</h3><span>Time</span></div>
        <div className="des">
      <div className="lis"><p>Current Bid</p><span>Bid</span></div>
      <div className="lis"><h4>Bidder</h4><span>Bidders</span></div>
      </div>
      </div>

    </div>

    <div className="data">
      <h2>Upcoming Bids</h2>

      <div className="datacontainerli">
      <div className="liss"> <h3>Auction Name</h3><span>Time</span></div> 
       <div className="des">
       <div className="lis"><p>Current Bid</p><span>Bid</span></div> 
      <div className="lis"> <h4>Bidder</h4><span>Bidders</span></div> 
      </div>
      </div>

    </div>
    </div>

    <div>
      <button>Create New Auction</button>
      <button>Browse Auctions</button>
    </div>
    <div>
      <div className="pastdata">
      <h2>Upcoming Bids</h2>
      <div className="datacontainerli">
        <div className="liss"><h3>Auction Name</h3><span>Time</span></div>
         <div className="des">
      <div className="lis"><p>Current Bid</p><span>Bid</span></div>
      <div className="lis"><h4>Bidder</h4><span>Bidders</span></div>
      </div>
      </div>
    </div>
    </div>
    <Footer />
    </div>
  );
}
export default Dashboard;