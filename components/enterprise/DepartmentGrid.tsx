import {
  BookOpen,
  Users,
  Code,
  Server,
  BarChart3,
  Crown,
  Cpu,
  Brain,
  Link as LinkIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { getEnterprise } from "@/lib/content";

const ent = getEnterprise();

const iconList = [BookOpen, Users, Code, Server, BarChart3, Crown, Cpu, Brain, LinkIcon];

const departments = ent.departmentGrid.departments.map((name, i) => ({
  name,
  icon: iconList[i] || BookOpen,
}));

export default function DepartmentGrid() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-12">
          {ent.departmentGrid.heading}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Card key={dept.name} hover className="text-center cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg bg-accent/10 mb-3">
                  <Icon size={20} className="text-accent" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white truncate">{dept.name}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
