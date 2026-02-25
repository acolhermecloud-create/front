import UpSellByPlan from "@/components/campaign/store/up-sell-by-plan";

export default function DestacarKaixinha({ title, description, slug }) {

  return (
    <UpSellByPlan
      title={title}
      description={description}
      slug={slug} />
  );
}