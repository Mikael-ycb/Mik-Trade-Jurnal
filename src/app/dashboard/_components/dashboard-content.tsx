// export default function DashboardContent() {
//   const { data, error, refetch } = useQuery({
//     queryKey: ["balance"],
//     queryFn: () => getBalanceSummary(),
//   });

//   return (
//     <section id="content" className="space-y-4">
//       <WizardInput refetch={refetch} />
//       <BalanceCards data={data} error={error} />
//       <GenerativeContent />
//     </section>
//   );
// }
