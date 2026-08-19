import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOMAINS } from '@/constants';
import { generateDocumentData } from '@/lib/utils';
import type { InternshipFormData } from '@/types';
import { FileText, Award, ArrowRight, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  domain: z.string().min(1, 'Please select a domain'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  internship: z.string().min(2, 'Internship name must be at least 2 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type FormSchema = z.infer<typeof formSchema>;

export default function DocumentForm() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {
    setIsGenerating(true);
    setTimeout(() => {
      const docData = generateDocumentData(data as InternshipFormData);
      localStorage.setItem('maximcode_doc_data', JSON.stringify(docData));
      toast.success('Documents generated successfully!');
      navigate('/documents');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Form Header */}
        <div className="bg-[hsl(215,62%,22%)] p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-[hsl(43,71%,47%)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Playfair_Display',serif]">Generate Documents</h2>
              <p className="text-[hsl(43,71%,75%)] text-sm">Fill in the details below</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-[hsl(215,50%,20%)]">
              Intern Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Arjun Sharma"
              {...register('name')}
              className="border-border focus-visible:ring-[hsl(215,62%,22%)]"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Domain */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[hsl(215,50%,20%)]">
              Domain <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => {
                setSelectedDomain(val);
                setValue('domain', val);
              }}
            >
              <SelectTrigger className="border-border focus:ring-[hsl(215,62%,22%)]">
                <SelectValue placeholder="Select internship domain" />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.domain && <p className="text-red-500 text-xs">{errors.domain.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-sm font-semibold text-[hsl(215,50%,20%)]">
              Role / Designation <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role"
              placeholder="e.g. Frontend Developer Intern"
              {...register('role')}
              className="border-border focus-visible:ring-[hsl(215,62%,22%)]"
            />
            {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
          </div>

          {/* Internship Name */}
          <div className="space-y-1.5">
            <Label htmlFor="internship" className="text-sm font-semibold text-[hsl(215,50%,20%)]">
              Internship / Program Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="internship"
              placeholder="e.g. Full Stack Web Development"
              {...register('internship')}
              className="border-border focus-visible:ring-[hsl(215,62%,22%)]"
            />
            {errors.internship && <p className="text-red-500 text-xs">{errors.internship.message}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-sm font-semibold text-[hsl(215,50%,20%)]">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="border-border focus-visible:ring-[hsl(215,62%,22%)]"
              />
              {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-sm font-semibold text-[hsl(215,50%,20%)]">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="border-border focus-visible:ring-[hsl(215,62%,22%)]"
              />
              {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Documents Preview Info */}
          <div className="bg-[hsl(43,100%,95%)] border border-[hsl(43,71%,70%)] rounded-xl p-4">
            <p className="text-xs font-semibold text-[hsl(43,60%,35%)] mb-2 uppercase tracking-wide">Documents that will be generated</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-[hsl(215,50%,25%)]">
                <Award className="w-4 h-4 text-[hsl(43,71%,47%)]" />
                <span>Completion Certificate</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[hsl(215,50%,25%)]">
                <FileText className="w-4 h-4 text-[hsl(215,62%,35%)]" />
                <span>Offer Letter</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-[hsl(215,62%,22%)] hover:bg-[hsl(215,70%,18%)] text-white font-semibold py-6 rounded-xl text-base transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Documents...
              </>
            ) : (
              <>
                Generate Documents
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
