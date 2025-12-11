import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { vehicleRates, zones, attractions } from '@/data/playbook-data';
import { Car, MapPin, Ticket, TrendingUp } from 'lucide-react';

export function PricingMatrix() {
  return (
    <div className="space-y-8">
      {/* Vehicle Rates */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Vehicle Rate Sheet (60% Markup Applied)
          </CardTitle>
          <CardDescription>2025-2026 pricing for private transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-semibold">Vehicle</th>
                  <th className="text-left py-3 font-semibold">Capacity</th>
                  <th className="text-right py-3 font-semibold">Full Day Dubai</th>
                  <th className="text-right py-3 font-semibold">Full Day Abu Dhabi</th>
                  <th className="text-right py-3 font-semibold">Half Day Dubai</th>
                  <th className="text-right py-3 font-semibold">Extra Hour</th>
                </tr>
              </thead>
              <tbody>
                {vehicleRates.map(v => (
                  <tr key={v.vehicle} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{v.vehicle}</td>
                    <td className="py-3">{v.capacity} guests</td>
                    <td className="py-3 text-right">
                      <Badge variant="gold">AED {v.fullDayDubai}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="success">AED {v.fullDayAbuDhabi}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="info">AED {v.halfDayDubai}</Badge>
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {v.extraHourMin}-{v.extraHourMax}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Zone Pricing */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Zone-Based Pickup Pricing
          </CardTitle>
          <CardDescription>60% markup applied — verify guest hotel before quoting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-semibold">Zone</th>
                  <th className="text-left py-3 font-semibold">Areas</th>
                  <th className="text-right py-3 font-semibold">7-Seater</th>
                  <th className="text-right py-3 font-semibold">12-Seater</th>
                  <th className="text-right py-3 font-semibold">22-Seater</th>
                </tr>
              </thead>
              <tbody>
                {zones.map(z => (
                  <tr key={z.zone} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3">
                      <Badge variant={z.zone <= 2 ? 'success' : z.zone <= 4 ? 'warning' : 'destructive'}>
                        Zone {z.zone}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span className="font-medium">{z.name}</span>
                      <p className="text-xs text-muted-foreground">{z.areas.join(', ')}</p>
                    </td>
                    <td className="py-3 text-right">AED {z.rates.seater7}</td>
                    <td className="py-3 text-right">AED {z.rates.seater12}</td>
                    <td className="py-3 text-right">AED {z.rates.seater22}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-medium">Other Emirates:</p>
            <p className="text-muted-foreground">Abu Dhabi/RAK: AED 480–608 | Fujairah: AED 488–608</p>
          </div>
        </CardContent>
      </Card>

      {/* Attractions */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Third-Party Attractions (60% Markup)
          </CardTitle>
          <CardDescription>Per-person ticket prices with profit margin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {attractions.map(attr => {
              const margin = Math.round(((attr.sellPrice - attr.publicRate) / attr.publicRate) * 100);
              return (
                <div 
                  key={attr.id}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{attr.name}</h4>
                    <Badge variant={attr.location === 'dubai' ? 'dubai' : 'abu-dhabi'} className="text-xs">
                      {attr.location === 'dubai' ? 'DXB' : 'AUH'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Public Rate:</span>
                      <span className="line-through text-muted-foreground">AED {attr.publicRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Sell Price:</span>
                      <span className="font-semibold text-primary">AED {attr.sellPrice}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    {margin}% margin
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
