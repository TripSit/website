import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/dashboard/appeals", permanent: false },
});
export default function Dashboard() {
  return null;
}
