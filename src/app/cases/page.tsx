import { Search } from "lucide-react";
import Link from "next/link";

const cases = [
  {
    id: "CASE-001",
    title: "Invoice Exception Review",
    risk: "High",
    status: "Human Review",
  },
  {
    id: "CASE-002",
    title: "Customer Complaint",
    risk: "Medium",
    status: "In Progress",
  },
  {
    id: "CASE-003",
    title: "KYC Verification",
    risk: "Low",
    status: "Resolved",
  },
  {
    id: "CASE-004",
    title: "Procurement Approval",
    risk: "Critical",
    status: "Escalated",
  },
];

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white p-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Cases</h1>
          <p className="text-slate-400 mt-2">
            Enterprise Case Management
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-2xl">
          <Search size={18} />
          <input
            className="bg-transparent outline-none"
            placeholder="Search case..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-5 text-left">Case ID</th>
              <th className="p-5 text-left">Title</th>
              <th className="p-5 text-left">Risk</th>
              <th className="p-5 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((item) => (
              <tr key={item.id} className="border-t border-slate-800">
                <td className="p-5 text-blue-400 font-semibold">
                  {item.id}
                </td>

                <td className="p-5">
                 <Link
                      href={`/cases/${item.id}`}
                       className="text-blue-400 hover:text-blue-300"
                 >
                            {item.title}
                    </Link>
                </td>

                <td className="p-5">
                  {item.risk}
                </td>

                <td className="p-5">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </main>
  );
}