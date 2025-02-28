import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ModuleCard } from "./Partials/ModuleCard";
import { Header } from "@/Components/Header";

const NO_DESCRIPTION_MESSAGE = "No description available for this module.";

export type ModuleCardType = {
  id: number;
  name: string;
  active: number;
  description: string | null;
  active_since: string | null;
  dataCount: number;
};

type DashboardProps = {
  modules: ModuleCardType[];
} & PageProps;

export default function Dashboard({ auth, modules }: DashboardProps) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <Header>
        <h2 className="mb-0 text-xl font-semibold text-gray-800">Dashboard</h2>
      </Header>

      <div className="py-12">
        <div className="flex flex-wrap items-center justify-center gap-4 mx-auto">
          {modules.length > 0 &&
            modules.map((module: ModuleCardType) => {
              return <ModuleCard key={`${module.id}`} module={module} />;
            })}
          {modules.length === 0 && (
            <div className="flex flex-col items-center gap-3">
              <span className="font-medium">
                You don't have any module registered yet
              </span>
              <span className="font-medium text-gray-500">
                You can register a new module at any time from the navigation
                menu
              </span>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
