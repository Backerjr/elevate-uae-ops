import React, { useState } from 'react';
import { 
  vehicleRates, 
  zones, 
  attractions, 
  type VehicleRate, 
  type Zone, 
  type Attraction 
} from '@/data/playbook-data';
import { 
  Car, 
  MapPin, 
  Ticket, 
  TrendingUp, 
  Info, 
  DollarSign, 
  Users 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Tab Component Logic ---
type PricingTab = 'fleet' | 'zones' | 'attractions';

export function PricingMatrix() {
  const [activeTab, setActiveTab] = useState<PricingTab>('fleet');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/30 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="px-4">
          <h2 className="text-xl font-display font-bold text-primary">Pricing Command</h2>
          <p className="text-xs text-muted-foreground">Live rates & margin analysis</p>
        </div>
        
        <div className="flex p-1 bg-black/20 rounded-xl">
          {[
            { id: 'fleet', label: 'Fleet Rates', icon: Car },
            { id: 'zones', label: 'Transfer Zones', icon: MapPin },
            { id: 'attractions', label: 'Attractions', icon: Ticket },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PricingTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary text-black shadow-glow"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card bg-card/40 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Blur */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {activeTab === 'fleet' && <FleetTable data={vehicleRates} />}
        {activeTab === 'zones' && <ZonesTable data={zones} />}
        {activeTab === 'attractions' && <AttractionsTable data={attractions} />}
      </div>
    </div>
  );
}

// --- Sub-Components ---

function FleetTable({ data }: { data: VehicleRate[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" /> Private Chauffeur Rates
        </h3>
        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
          Rates in AED
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-4 pl-4">Vehicle Type</th>
              <th className="py-4 text-center">Capacity</th>
              <th className="py-4 text-right">Full Day (10h)</th>
              <th className="py-4 text-right">Half Day (5h)</th>
              <th className="py-4 text-right">Abu Dhabi (10h)</th>
              <th className="py-4 text-right pr-4">DXB Transfer</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((rate, i) => (
              <tr 
                key={rate.vehicle} 
                className={cn(
                  "border-b border-white/5 hover:bg-white/5 transition-colors",
                  i % 2 === 0 ? "bg-white/[0.02]" : ""
                )}
              >
                <td className="py-4 pl-4 font-medium text-white">{rate.vehicle}</td>
                <td className="py-4 text-center text-muted-foreground flex justify-center items-center gap-1">
                  <Users className="w-3 h-3" /> {rate.capacity}
                </td>
                <td className="py-4 text-right text-white font-mono">{rate.fullDayDubai}</td>
                <td className="py-4 text-right text-muted-foreground font-mono">{rate.halfDayDubai}</td>
                <td className="py-4 text-right text-white font-mono">{rate.fullDayAbuDhabi}</td>
                <td className="py-4 text-right pr-4 text-primary font-bold font-mono">{rate.transferDXB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ZonesTable({ data }: { data: Zone[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-sm">
        <Info className="w-4 h-4 shrink-0" />
        <p>Always verify the guest's hotel location against these zones before quoting transfer rates.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((zone) => (
          <div key={zone.zone} className="bg-black/20 border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-lg font-bold text-white">Zone {zone.zone}: {zone.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {zone.areas.join(', ')}
                </p>
              </div>
              <div className="bg-primary/20 text-primary w-8 h-8 flex items-center justify-center rounded-full font-bold">
                {zone.zone}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              {Object.entries(zone.rates).map(([key, price]) => {
                const label = key.replace('seater', '') + ' Seater';
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-mono text-white font-medium">{price} AED</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttractionsTable({ data }: { data: Attraction[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" /> Attraction Pricing & Margins
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-4 pl-4">Attraction</th>
              <th className="py-4">Category</th>
              <th className="py-4 text-right">Net Cost</th>
              <th className="py-4 text-right">Sell Price</th>
              <th className="py-4 text-right pr-4">Profit</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((item, i) => {
              const profit = item.sellPrice - item.netPrice;
              const marginPercent = ((profit / item.sellPrice) * 100).toFixed(0);
              const isHighMargin = parseInt(marginPercent) > 20;

              return (
                <tr 
                  key={item.id} 
                  className={cn(
                    "border-b border-white/5 hover:bg-white/5 transition-colors group",
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  )}
                >
                  <td className="py-4 pl-4 font-medium text-white group-hover:text-primary transition-colors">
                    {item.name}
                  </td>
                  <td className="py-4">
                    <span className="text-xs uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-muted-foreground">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 text-right text-muted-foreground font-mono">{item.netPrice}</td>
                  <td className="py-4 text-right text-white font-bold font-mono">{item.sellPrice}</td>
                  <td className="py-4 text-right pr-4">
                    <div className={cn(
                      "inline-flex items-center gap-1 font-mono font-bold px-2 py-1 rounded",
                      isHighMargin ? "bg-green-500/10 text-green-400" : "text-white/60"
                    )}>
                      {profit} AED
                      {isHighMargin && <TrendingUp className="w-3 h-3" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}