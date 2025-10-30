import React, { useState } from 'react';
import { MarketingCampaign, CampaignStatus } from '../types';
import { CloseIcon } from './icons';

interface AddCampaignModalProps {
  onClose: () => void;
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
}

const AddCampaignModal: React.FC<AddCampaignModalProps> = ({ onClose, setCampaigns }) => {
  const [formData, setFormData] = useState<Omit<MarketingCampaign, 'id'>>({
    name: '',
    channel: 'Facebook',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: 0,
    status: CampaignStatus.PLANNING,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'budget' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: MarketingCampaign = {
      ...formData,
      id: `CAMP-${Date.now()}`,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">إضافة حملة تسويقية جديدة</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">اسم الحملة</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="channel" className="block text-sm font-medium text-slate-700">القناة</label>
              <input type="text" name="channel" id="channel" value={formData.channel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" placeholder="مثال: Facebook, Google Ads" required />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-slate-700">الميزانية (ج.م)</label>
              <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" min="0" required />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">تاريخ البدء</label>
              <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">تاريخ الانتهاء</label>
              <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div className="col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">الحالة</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm">
                {Object.values(CampaignStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              حفظ
            </button>
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCampaignModal;
