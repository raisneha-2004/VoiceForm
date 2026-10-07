import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { useFormStore } from '../../store/useFormStore';
import { templateService } from '../../api/client';
import type { FormTemplate, FormField, FieldType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { DynamicFieldRenderer } from '../../components/form/DynamicFieldRenderer';
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Eye,
  Save,
  ShieldCheck,
  Mic,
  Settings,
  Hash,
  Type,
  Calendar,
  List,
  CheckSquare,
  Radio,
  FileText,
  Mail,
  Phone,
  UploadCloud
} from 'lucide-react';

const FIELD_TYPE_OPTIONS: { type: FieldType; label: string; icon: any; description: string }[] = [
  { type: 'text', label: 'Short Text', icon: Type, description: 'Single-line text input (name, city, title)' },
  { type: 'textarea', label: 'Long Text / Bio', icon: FileText, description: 'Multi-line notes, address, or descriptions' },
  { type: 'number', label: 'Number / Age', icon: Hash, description: 'Numeric values, quantity, age, income' },
  { type: 'email', label: 'Email Address', icon: Mail, description: 'Validated email format with @ symbol' },
  { type: 'phone', label: 'Phone Number', icon: Phone, description: 'Mobile/contact number with digit formatting' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker (DOB, appointment, travel date)' },
  { type: 'select', label: 'Dropdown Select', icon: List, description: 'Single selection from custom list' },
  { type: 'radio', label: 'Radio Choice', icon: Radio, description: 'Multiple choice radio buttons' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Boolean consent or multi-select' },
  { type: 'file', label: 'File Upload', icon: UploadCloud, description: 'Document or image attachment' }
];

const TEMPLATE_CATEGORIES = [
  'My Templates',
  'General',
  'Healthcare',
  'Finance',
  'Government',
  'Education',
  'Employment',
  'Real Estate',
  'Travel',
  'Events'
];

export const FormBuilderPage: React.FC = () => {
  const { addToast } = useThemeStore();
  const { setActiveTemplate, setFieldValue } = useFormStore();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState<boolean>(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Field Edit State
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldIsSensitive, setFieldIsSensitive] = useState(false);
  const [fieldHelpText, setFieldHelpText] = useState('');
  const [fieldOptionsRaw, setFieldOptionsRaw] = useState('');
  const [fieldMin, setFieldMin] = useState<number | ''>('');
  const [fieldMax, setFieldMax] = useState<number | ''>('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const list = await templateService.getAll();
      setTemplates(list);
      if (list.length > 0 && !selectedTemplate) {
        // Look for existing custom or default
        const custom = list.find((t) => t.category === 'My Templates');
        setSelectedTemplate(custom || list[0]);
      }
    } catch (e) {
      console.error('Failed to load templates in builder', e);
    }
  };

  const handleCreateNewTemplate = () => {
    const newTpl: FormTemplate = {
      id: 'template-custom-' + Math.random().toString(36).substring(2, 8),
      title: 'My Custom Voice Form',
      description: 'Custom voice-enabled form built with Form Builder.',
      category: 'My Templates',
      icon: 'Sparkles',
      estimatedMinutes: 3,
      isPublished: true,
      fields: [
        {
          id: 'f-init-1',
          key: 'fullName',
          label: 'Full Name',
          type: 'text',
          placeholder: 'e.g. Rahul Sharma',
          required: true,
          isSensitive: false,
          helpText: 'Speak or type your full legal name'
        },
        {
          id: 'f-init-2',
          key: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'rahul@example.com',
          required: true,
          isSensitive: false
        },
        {
          id: 'f-init-3',
          key: 'phoneNumber',
          label: 'Mobile Number',
          type: 'phone',
          placeholder: '+91 9876543210',
          required: false,
          isSensitive: true,
          helpText: 'Sensitive data — will require voice confirmation'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSelectedTemplate(newTpl);
    setActiveTab('editor');
    addToast({
      type: 'info',
      title: 'New Template Draft Created',
      message: 'Start adding and customizing fields below.'
    });
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
    if (!selectedTemplate.title.trim()) {
      addToast({ type: 'warning', title: 'Title Required', message: 'Please give your form template a title.' });
      return;
    }
    if (selectedTemplate.fields.length === 0) {
      addToast({ type: 'warning', title: 'Fields Required', message: 'Add at least 1 field to save template.' });
      return;
    }

    try {
      setIsSaving(true);
      const exists = templates.some((t) => t.id === selectedTemplate.id);
      let saved: FormTemplate;

      if (exists) {
        saved = await templateService.update(selectedTemplate.id, selectedTemplate);
      } else {
        saved = await templateService.create(selectedTemplate);
      }

      await loadTemplates();
      setSelectedTemplate(saved);

      addToast({
        type: 'success',
        title: 'Form Template Saved!',
        message: `"${saved.title}" is ready in My Templates and voice fillable.`
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Save Failed', message: 'Could not save form template.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLaunchInVoiceWorkspace = () => {
    if (!selectedTemplate) return;
    setActiveTemplate(selectedTemplate);
    navigate(`/workspace/${selectedTemplate.id}`);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (!selectedTemplate) return;
    const fields = [...selectedTemplate.fields];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIdx];
    fields[targetIdx] = temp;

    setSelectedTemplate({ ...selectedTemplate, fields });
  };

  const handleDeleteField = (index: number) => {
    if (!selectedTemplate) return;
    const fields = selectedTemplate.fields.filter((_, i) => i !== index);
    setSelectedTemplate({ ...selectedTemplate, fields });
  };

  const openFieldEditor = (field?: FormField, index?: number) => {
    if (field && index !== undefined) {
      setEditingFieldIndex(index);
      setFieldLabel(field.label);
      setFieldKey(field.key);
      setFieldType(field.type);
      setFieldPlaceholder(field.placeholder || '');
      setFieldRequired(field.required);
      setFieldIsSensitive(field.isSensitive || false);
      setFieldHelpText(field.helpText || '');
      setFieldOptionsRaw(field.options?.map((o) => `${o.label}:${o.value}`).join(', ') || '');
      setFieldMin(field.validation?.min ?? '');
      setFieldMax(field.validation?.max ?? '');
    } else {
      setEditingFieldIndex(null);
      setFieldLabel('');
      setFieldKey('');
      setFieldType('text');
      setFieldPlaceholder('');
      setFieldRequired(false);
      setFieldIsSensitive(false);
      setFieldHelpText('');
      setFieldOptionsRaw('');
      setFieldMin('');
      setFieldMax('');
    }
    setIsFieldEditorOpen(true);
  };

  const handleLabelChange = (val: string) => {
    setFieldLabel(val);
    if (editingFieldIndex === null) {
      // Auto-generate camelCase key if user hasn't typed custom key
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(' ')
        .map((word, idx) => (idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('');
      setFieldKey(generated || 'fieldKey');
    }
  };

  const handleSaveField = () => {
    if (!selectedTemplate || !fieldLabel.trim() || !fieldKey.trim()) {
      addToast({ type: 'warning', title: 'Missing Info', message: 'Field label and key are required.' });
      return;
    }

    // Parse options for select/radio
    let options: { label: string; value: string }[] | undefined = undefined;
    if (['select', 'radio', 'checkbox'].includes(fieldType) && fieldOptionsRaw.trim()) {
      options = fieldOptionsRaw.split(',').map((item) => {
        const parts = item.trim().split(':');
        return {
          label: parts[0]?.trim() || 'Option',
          value: parts[1]?.trim() || parts[0]?.trim().toLowerCase().replace(/\s+/g, '-')
        };
      });
    }

    const newFieldDef: FormField = {
      id:
        editingFieldIndex !== null
          ? selectedTemplate.fields[editingFieldIndex].id
          : 'f-' + Math.random().toString(36).substring(2, 8),
      key: fieldKey.trim(),
      label: fieldLabel.trim(),
      type: fieldType,
      placeholder: fieldPlaceholder.trim() || undefined,
      required: fieldRequired,
      isSensitive: fieldIsSensitive,
      helpText: fieldHelpText.trim() || undefined,
      options,
      validation: {
        min: fieldMin !== '' ? Number(fieldMin) : undefined,
        max: fieldMax !== '' ? Number(fieldMax) : undefined
      }
    };

    let updatedFields = [...selectedTemplate.fields];
    if (editingFieldIndex !== null) {
      updatedFields[editingFieldIndex] = newFieldDef;
    } else {
      updatedFields.push(newFieldDef);
    }

    setSelectedTemplate({ ...selectedTemplate, fields: updatedFields });
    setIsFieldEditorOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-brand-500/15 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-purple-500/20 dark:border-purple-500/30 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Form Schema Studio</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">• Voice-Ready Templates</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Custom Form Builder & Schema Designer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Design your own custom forms field-by-field. Saved templates appear directly in your
            template library and can be filled with continuous voice recognition.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCreateNewTemplate}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>New Custom Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{activeTab === 'preview' ? 'Back to Editor' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveTemplate}
            className="px-4 py-2 text-xs font-extrabold rounded-xl bg-theme-gradient text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Template'}</span>
          </button>

          {selectedTemplate && (
            <button
              type="button"
              onClick={handleLaunchInVoiceWorkspace}
              title="Launch directly in Voice Workspace"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Fill with Voice</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Area: Template Selector + Editor / Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Metadata & Quick Switcher (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Template Switcher Dropdown */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Select or Edit Template
            </label>
            <select
              value={selectedTemplate?.id || ''}
              onChange={(e) => {
                const found = templates.find((t) => t.id === e.target.value);
                if (found) {
                  setSelectedTemplate(found);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Template Metadata Card */}
          {selectedTemplate && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-purple-500" />
                  <span>Form Details</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  {selectedTemplate.fields.length} Fields
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Form Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={selectedTemplate.title}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, title: e.target.value })}
                  placeholder="e.g. Clinic Patient Registration"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={selectedTemplate.category}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  {TEMPLATE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, description: e.target.value })}
                  placeholder="Brief description of this form..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Estimated Time (minutes) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Estimated Voice Fill Time (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={selectedTemplate.estimatedMinutes || 3}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      estimatedMinutes: Number(e.target.value) || 3
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Schema Field List & Reordering OR Live Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'editor' ? (
            /* Schema Fields Editor */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Form Schema Fields ({selectedTemplate?.fields.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Drag or use arrow buttons to reorder fields. Click edit to configure types & sensitive flags.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openFieldEditor()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Field</span>
                </button>
              </div>

              {/* Fields List */}
              <div className="space-y-2.5">
                {selectedTemplate?.fields.map((field, idx) => {
                  const typeDef = FIELD_TYPE_OPTIONS.find((t) => t.type === field.type);
                  const Icon = typeDef?.icon || Type;

                  return (
                    <div
                      key={field.id || idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400/50 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Index Badge */}
                        <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>

                        {/* Type Icon */}
                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {field.label}
                            </span>
                            {field.required && (
                              <span className="px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                                Required
                              </span>
                            )}
                            {field.isSensitive && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Sensitive</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate flex items-center gap-2">
                            <span>key: {field.key}</span>
                            <span>•</span>
                            <span className="capitalize">{field.type}</span>
                            {field.options && <span>• {field.options.length} options</span>}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveField(idx, 'up')}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (selectedTemplate?.fields.length || 0) - 1}
                          onClick={() => handleMoveField(idx, 'down')}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openFieldEditor(field, idx)}
                          title="Edit Field Schema"
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteField(idx)}
                          title="Delete Field"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {(!selectedTemplate?.fields || selectedTemplate.fields.length === 0) && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <p className="text-xs text-slate-500">No fields added yet to this template.</p>
                    <button
                      type="button"
                      onClick={() => openFieldEditor()}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Field</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Live Interactive Preview */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Live Form Preview — {selectedTemplate?.title}
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Interactive Mode
                </span>
              </div>

              <div className="space-y-4">
                {selectedTemplate?.fields.map((field) => (
                  <div key={field.id || field.key} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{field.label}</span>
                      {field.required && <span className="text-rose-500">*</span>}
                      {field.isSensitive && (
                        <span className="text-[10px] text-amber-500 flex items-center gap-0.5 font-semibold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Sensitive</span>
                        </span>
                      )}
                    </label>

                    <DynamicFieldRenderer
                      field={field}
                      onFieldChange={(key: string, val: any) => setFieldValue(key, val)}
                    />

                    {field.helpText && (
                      <p className="text-[11px] text-slate-400 italic">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Field Editor Modal */}
      <Modal
        isOpen={isFieldEditorOpen}
        onClose={() => setIsFieldEditorOpen(false)}
        title={editingFieldIndex !== null ? 'Edit Field Schema' : 'Add New Field to Form'}
        maxWidth="xl"
      >
        <div className="space-y-4 p-1">
          {/* Label */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Field Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fieldLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Current Residential Address"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Key / ID */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Field Key / ID (API Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              placeholder="e.g. residentialAddress"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Field Type Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Field Input Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {FIELD_TYPE_OPTIONS.map((item) => {
                const isSelected = fieldType === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFieldType(item.type)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-purple-500" />
                    <span className="text-xs font-bold truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options if Select / Radio / Checkbox */}
          {['select', 'radio', 'checkbox'].includes(fieldType) && (
            <div className="space-y-1 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <label className="text-xs font-bold text-purple-900 dark:text-purple-200">
                Options (comma separated: Label:Value or just Label)
              </label>
              <input
                type="text"
                value={fieldOptionsRaw}
                onChange={(e) => setFieldOptionsRaw(e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
                className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 text-xs"
              />
            </div>
          )}

          {/* Placeholder */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Placeholder
            </label>
            <input
              type="text"
              value={fieldPlaceholder}
              onChange={(e) => setFieldPlaceholder(e.target.value)}
              placeholder="e.g. Enter value..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>

          {/* Help Text / Voice Hint */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Voice Prompt / Spoken Instruction Hint
            </label>
            <input
              type="text"
              value={fieldHelpText}
              onChange={(e) => setFieldHelpText(e.target.value)}
              placeholder="e.g. State your city name clearly"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>

          {/* Toggles: Required & Sensitive */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={fieldRequired}
                onChange={(e) => setFieldRequired(e.target.checked)}
                className="w-4 h-4 rounded-sm text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Required Field
              </span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 cursor-pointer">
              <input
                type="checkbox"
                checked={fieldIsSensitive}
                onChange={(e) => setFieldIsSensitive(e.target.checked)}
                className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sensitive Data</span>
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFieldEditorOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveField}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25"
            >
              {editingFieldIndex !== null ? 'Update Field' : 'Insert Field'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
