import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Bell,
  FileText,
  DollarSign,
  Target,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface TaxEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'deadline' | 'reminder' | 'planning';
  priority: 'high' | 'medium' | 'low';
  category: 'itr' | 'advance_tax' | 'tds' | 'investment' | 'compliance';
  completed?: boolean;
  legalReference: string;
  actionItems: string[];
}

interface MonthView {
  year: number;
  month: number;
  daysInMonth: number;
  firstDayOfWeek: number;
  events: TaxEvent[];
}

const TaxCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monthView, setMonthView] = useState<MonthView | null>(null);
  const [completedEvents, setCompletedEvents] = useState<Set<string>>(new Set());

  const taxEvents: TaxEvent[] = [
    // ITR Filing Deadlines
    {
      id: 'itr_individual_2024',
      title: 'ITR Filing Deadline - Individuals',
      description: 'Last date to file Income Tax Return for individuals (non-audit cases)',
      date: new Date('2024-07-31'),
      type: 'deadline',
      priority: 'high',
      category: 'itr',
      legalReference: 'Section 139(1) of Income Tax Act, 1961',
      actionItems: [
        'Gather all tax documents (Form 16, investment proofs)',
        'Calculate capital gains from all transactions',
        'Choose appropriate ITR form (ITR-1/ITR-2/ITR-3)',
        'File ITR online or through CA',
        'Verify ITR within 120 days'
      ]
    },
    {
      id: 'itr_audit_2024',
      title: 'ITR Filing Deadline - Audit Cases',
      description: 'Last date to file ITR for cases requiring tax audit',
      date: new Date('2024-10-31'),
      type: 'deadline',
      priority: 'high',
      category: 'itr',
      legalReference: 'Section 139(1) of Income Tax Act, 1961',
      actionItems: [
        'Complete tax audit by September 30',
        'File ITR with audit report',
        'Submit all required forms'
      ]
    },

    // Advance Tax Deadlines
    {
      id: 'advance_tax_q1_2024',
      title: 'Advance Tax Q1 Payment',
      description: '15% of annual tax liability due',
      date: new Date('2024-06-15'),
      type: 'deadline',
      priority: 'medium',
      category: 'advance_tax',
      legalReference: 'Section 208 of Income Tax Act, 1961',
      actionItems: [
        'Calculate estimated annual income',
        'Pay 15% of tax liability online',
        'Save payment receipt'
      ]
    },
    {
      id: 'advance_tax_q2_2024',
      title: 'Advance Tax Q2 Payment',
      description: '45% of annual tax liability due (cumulative)',
      date: new Date('2024-09-15'),
      type: 'deadline',
      priority: 'medium',
      category: 'advance_tax',
      legalReference: 'Section 208 of Income Tax Act, 1961',
      actionItems: [
        'Review H1 income and revise estimates',
        'Pay cumulative 45% of tax liability',
        'Adjust for any regime changes'
      ]
    },
    {
      id: 'advance_tax_q3_2024',
      title: 'Advance Tax Q3 Payment',
      description: '75% of annual tax liability due (cumulative)',
      date: new Date('2024-12-15'),
      type: 'deadline',
      priority: 'medium',
      category: 'advance_tax',
      legalReference: 'Section 208 of Income Tax Act, 1961',
      actionItems: [
        'Calculate revised annual tax liability',
        'Pay cumulative 75% of tax liability',
        'Plan for final quarter payments'
      ]
    },
    {
      id: 'advance_tax_q4_2024',
      title: 'Advance Tax Q4 Payment',
      description: '100% of annual tax liability due',
      date: new Date('2025-03-15'),
      type: 'deadline',
      priority: 'medium',
      category: 'advance_tax',
      legalReference: 'Section 208 of Income Tax Act, 1961',
      actionItems: [
        'Finalize annual income calculations',
        'Pay remaining tax liability',
        'Prepare for ITR filing'
      ]
    },

    // Investment Planning Reminders
    {
      id: 'section_80c_planning',
      title: 'Section 80C Investment Planning',
      description: 'Plan and execute Section 80C investments before year-end',
      date: new Date('2024-12-31'),
      type: 'reminder',
      priority: 'high',
      category: 'investment',
      legalReference: 'Section 80C of Income Tax Act, 1961',
      actionItems: [
        'Review current 80C investments',
        'Calculate remaining investment needed',
        'Invest in ELSS, PPF, or other qualifying instruments',
        'Collect investment receipts'
      ]
    },
    {
      id: 'ltcg_harvesting',
      title: 'LTCG Harvesting Window',
      description: 'Optimal time to book LTCG within ₹1 lakh exemption',
      date: new Date('2025-01-31'),
      type: 'planning',
      priority: 'medium',
      category: 'investment',
      legalReference: 'Section 112A of Income Tax Act, 1961',
      actionItems: [
        'Review equity portfolio for LTCG opportunities',
        'Calculate current LTCG for the year',
        'Book profits within ₹1 lakh exemption limit',
        'Maintain records of transactions'
      ]
    },

    // Compliance Reminders
    {
      id: 'tds_certificate_collection',
      title: 'Collect TDS Certificates',
      description: 'Ensure all TDS certificates (Form 16A) are collected',
      date: new Date('2024-05-31'),
      type: 'reminder',
      priority: 'medium',
      category: 'compliance',
      legalReference: 'Section 203 of Income Tax Act, 1961',
      actionItems: [
        'Contact all deductors for TDS certificates',
        'Verify TDS amount against 26AS',
        'Follow up on missing certificates',
        'File grievance if discrepancies found'
      ]
    },

    // Quarterly Reminders
    {
      id: 'portfolio_review_q1',
      title: 'Quarterly Portfolio Review',
      description: 'Review portfolio performance and tax implications',
      date: new Date('2024-06-30'),
      type: 'planning',
      priority: 'low',
      category: 'investment',
      legalReference: 'Best Practice for Tax Planning',
      actionItems: [
        'Review portfolio performance',
        'Assess unrealized gains/losses',
        'Plan tax-loss harvesting opportunities',
        'Rebalance if needed'
      ]
    }
  ];

  useEffect(() => {
    calculateMonthView();
  }, [currentDate]);

  const calculateMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    // Filter events for current month
    const monthEvents = taxEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    setMonthView({
      year,
      month,
      daysInMonth,
      firstDayOfWeek,
      events: monthEvents
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: number) => {
    if (!monthView) return [];
    return monthView.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'itr': return <FileText className="w-4 h-4" />;
      case 'advance_tax': return <DollarSign className="w-4 h-4" />;
      case 'investment': return <Target className="w-4 h-4" />;
      case 'tds': return <FileText className="w-4 h-4" />;
      case 'compliance': return <CheckCircle className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const isEventOverdue = (event: TaxEvent) => {
    return new Date() > event.date && !completedEvents.has(event.id);
  };

  const isEventUpcoming = (event: TaxEvent) => {
    const daysDiff = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30 && daysDiff >= 0;
  };

  const markEventCompleted = (eventId: string) => {
    setCompletedEvents(prev => new Set([...prev, eventId]));
  };

  const upcomingEvents = taxEvents
    .filter(event => isEventUpcoming(event) && !completedEvents.has(event.id))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const overdueEvents = taxEvents
    .filter(event => isEventOverdue(event))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (!monthView) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tax Calendar</h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Stay on top of important tax deadlines and planning opportunities
          </p>
        </div>

        {/* Alerts for Overdue and Upcoming */}
        {overdueEvents.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong className="text-red-800">
                You have {overdueEvents.length} overdue tax deadline{overdueEvents.length > 1 ? 's' : ''}!
              </strong>
              <div className="mt-2 space-y-1">
                {overdueEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="text-sm text-red-700">
                    • {event.title} - Due: {event.date.toLocaleDateString()}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {upcomingEvents.length > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong className="text-yellow-800">
                {upcomingEvents.length} deadline{upcomingEvents.length > 1 ? 's' : ''} approaching in the next 30 days
              </strong>
              <div className="mt-2 space-y-1">
                {upcomingEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="text-sm text-yellow-700">
                    • {event.title} - Due: {event.date.toLocaleDateString()}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">
                    {monthNames[monthView.month]} {monthView.year}
                  </CardTitle>
                  <div className="flex gap-1 sm:gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ArrowLeft className="w-4 h-4" />
                      <span className="sr-only">Previous month</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ArrowRight className="w-4 h-4" />
                      <span className="sr-only">Next month</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px sm:gap-1 mb-2 sm:mb-4">
                  {daysOfWeek.map(day => (
                    <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-px sm:gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: monthView.firstDayOfWeek }, (_, i) => (
                    <div key={`empty-${i}`} className="h-16 sm:h-20 lg:h-24 p-1" />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: monthView.daysInMonth }, (_, i) => {
                    const date = i + 1;
                    const events = getEventsForDate(date);
                    const isToday = new Date().toDateString() === new Date(monthView.year, monthView.month, date).toDateString();
                    
                    return (
                      <div
                        key={date}
                        className={`h-16 sm:h-20 lg:h-24 p-1 border rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                          isToday ? 'bg-primary/10 border-primary' : 'border-border'
                        }`}
                        onClick={() => setSelectedDate(new Date(monthView.year, monthView.month, date))}
                      >
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                          {date}
                        </div>
                        <div className="space-y-px">
                          {/* Mobile: show max 1 event, Desktop: show max 2 events */}
                          <div className="sm:hidden">
                            {events.slice(0, 1).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-0.5 rounded ${getPriorityColor(event.priority)}`}
                                title={event.title}
                              >
                                •
                              </div>
                            ))}
                            {events.length > 1 && (
                              <div className="text-xs text-muted-foreground">
                                +{events.length - 1}
                              </div>
                            )}
                          </div>
                          <div className="hidden sm:block">
                            {events.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${getPriorityColor(event.priority)}`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {events.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{events.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No upcoming deadlines in the next 30 days</p>
                ) : (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getCategoryIcon(event.category)}
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        </div>
                        <Badge variant="outline" className={`${getPriorityColor(event.priority)} ml-2 flex-shrink-0`}>
                          {event.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Due: {event.date.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <Button
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                        onClick={() => markEventCompleted(event.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Complete
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    <span className="hidden sm:inline">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="sm:hidden">
                      {selectedDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getEventsForDate(selectedDate.getDate()).length === 0 ? (
                    <p className="text-muted-foreground text-sm">No events scheduled for this date</p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {getEventsForDate(selectedDate.getDate()).map(event => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {getCategoryIcon(event.category)}
                              <h4 className="font-medium text-sm">{event.title}</h4>
                            </div>
                            <Badge className={`${getPriorityColor(event.priority)} ml-2 flex-shrink-0`}>
                              {event.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-none">{event.description}</p>
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Action Items:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {event.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t break-words">
                            <strong>Legal Reference:</strong> {event.legalReference}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TaxCalendar;