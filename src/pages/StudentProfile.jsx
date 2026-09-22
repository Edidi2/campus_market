import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { User, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";

const UNIVERSITIES = ["ASTU", "Addis Ababa University", "Bahir Dar University", "Mekelle University", "Hawassa University"];
const DEPARTMENTS = ["Computer Science", "Engineering", "Business", "Medicine", "Natural Sciences", "Other"];

export default function StudentProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    student_id_number: "",
    university: UNIVERSITIES[0],
    department: DEPARTMENTS[0],
    year_of_study: "1st",
    phone: "",
    id_photo_url: "",
    profile_photo_url: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("student_profiles").select("*").limit(1);
        if (error) throw error;
        if (data && data.length) {
          setProfile(data[0]);
          setForm((f) => ({ ...f, ...data[0] }));
        }
      } catch (e) {
        // ignore if table doesn't exist yet or empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    if (!form.full_name || !form.student_id_number) {
      toast({ title: "Missing fields", description: "Full name and student ID are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (profile?.id) {
        const { error } = await supabase
          .from("student_profiles")
          .update({ ...form, verified: true })
          .eq("id", profile.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("student_profiles")
          .insert([{ ...form, verified: true }])
          .select()
          .single();
        if (error) throw error;
        if (data) setProfile(data);
      }
      toast({ title: "Profile saved", description: "Your student profile is verified." });
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><User className="h-6 w-6" /></div>
        <div>
          <h1 className="text-2xl font-bold">Student registration</h1>
          <p className="text-sm text-muted-foreground">Verify your identity to buy and sell on campus.</p>
        </div>
      </div>

      {profile?.verified && (
        <div className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
          <BadgeCheck className="h-4 w-4" /> Verified student
        </div>
      )}

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Full name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><Label>Student ID number *</Label><Input value={form.student_id_number} onChange={(e) => setForm({ ...form, student_id_number: e.target.value })} /></div>
          <div>
            <Label>University</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })}>
              {UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <Label>Department</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <Label>Year of study</Label>
            <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.year_of_study} onChange={(e) => setForm({ ...form, year_of_study: e.target.value })}>
              {["1st", "2nd", "3rd", "4th", "5th"].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09..." /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload label="Student ID photo" value={form.id_photo_url} onChange={(v) => setForm({ ...form, id_photo_url: v })} />
          <ImageUpload label="3/4 profile photo" value={form.profile_photo_url} onChange={(v) => setForm({ ...form, profile_photo_url: v })} />
        </div>
        <Button className="w-full h-11" disabled={saving} onClick={save}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save & verify profile"}
        </Button>
      </div>
    </div>
  );
}
