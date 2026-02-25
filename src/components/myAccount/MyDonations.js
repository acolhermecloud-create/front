import DonationUserCard from "../donation-user-card";

export default function MyDonations({ handleDesactiveCampaign, handleEditCampaign, campaings }) {

  return (
    <>
      {campaings && campaings.map((donation, index) =>
        <DonationUserCard
          handleDesactiveCampaign={handleDesactiveCampaign}
          handleEditCampaign={() => handleEditCampaign(donation)}
          key={index}
          id={donation.id}
          title={donation.title}
          description={donation.description}
          status={donation.status}
          date={donation.createdAt}
          medias={donation.media}
          slug={donation.slug}
          goalAmount={donation.financialGoal}
          donations={donation.donations}
          leverageRequest={donation.leverageRequest}
          reason={donation.reason}
        />
      )}
    </>
  );
}