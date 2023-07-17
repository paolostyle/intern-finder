'use client';

import { HelpCircleIcon } from 'lucide-react';

interface Props {
  onSubmit: (formData: FormData) => void;
  applySorting: () => void;
}

export const Settings = ({ onSubmit, applySorting }: Props) => {
  return (
    <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">Ustawienia</div>
      <div className="collapse-content">
        <form className="flex flex-col gap-4" action={onSubmit}>
          <div className="flex items-start gap-4">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Adres wyjazdu</span>
              </label>
              <input
                type="text"
                name="origin"
                placeholder="np. Pokątna 1, Warszawa"
                className="input input-bordered input-sm w-full max-w-xs"
                defaultValue={
                  typeof window !== 'undefined' ? localStorage.getItem('address') ?? '' : ''
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Dzień tygodnia</span>
              </label>
              <select
                className="select select-bordered select-sm w-36 max-w-xs"
                name="dayOfTheWeek"
              >
                <option value={1}>Poniedziałek</option>
                <option value={2}>Wtorek</option>
                <option value={3}>Środa</option>
                <option value={4}>Czwartek</option>
                <option value={5}>Piątek</option>
                <option value={6}>Sobota</option>
                <option value={7}>Niedziela</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex gap-1 items-center">
                  Godzina wyjazdu
                  <div className="tooltip" data-tip="Działa dla podróży samochodem i komunikacją">
                    <HelpCircleIcon className="w-4 h-4" tabIndex={0} />
                  </div>
                </span>
              </label>
              <input
                type="time"
                name="departureTime"
                className="input input-bordered input-sm w-28"
                defaultValue="07:00"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex gap-1 items-center">
                  Godzina przyjazdu
                  <div className="tooltip" data-tip="Działa tylko dla podróży komunikacją">
                    <HelpCircleIcon className="w-4 h-4" tabIndex={0} />
                  </div>
                </span>
              </label>
              <input
                type="time"
                name="arrivalTime"
                className="input input-bordered input-sm w-28"
                defaultValue="08:00"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <button type="submit" className="btn btn-primary btn-sm">
              Wyślij
            </button>
            <button type="button" onClick={applySorting} className="btn btn-secondary btn-sm">
              Zapisz sortowanie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
