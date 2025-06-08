import ProfileCard from "@/Components/ui/Profilecard";
  

function Auction(){
    return (
        <div>
            <h1>Live Auctions</h1>
            <div className="decard">
                <div>Live Auctions</div>
                <div>Total Value</div>
                <div></div>
                <ProfileCard
                    name="Javi A. Torres"
                    title="Software Engineer"
                    handle="javicodes"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/path/to/avatar.jpg"
                    showUserInfo={true}
                    enableTilt={true}
                    onContactClick={() => console.log('Contact clicked')}
                />
            </div>
        </div>
    );
}
export default Auction;