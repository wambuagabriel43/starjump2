import React, { useState, useEffect } from 'react';
import { Eye, Trash2, CheckCircle, Clock, User, Mail, Phone, Calendar, MapPin, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BookingSubmission {
  id: string;
  submission_type: string;
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  booking_date?: string;
  location?: string;
  event_type?: string;
  number_of_children?: string;
  custom_needs?: string;
  institution?: string;
  preferred_dates?: string;
  status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

const BookingSubmissionsManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<BookingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<BookingSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('booking_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      );
      
      alert('Status updated successfully!');
    } catch (err) {
      alert('Error updating status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const { error } = await supabase
        .from('booking_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      setSelectedSubmission(null);
      alert('Submission deleted successfully!');
    } catch (err) {
      alert('Error deleting submission: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const filteredSubmissions = statusFilter === 'all' 
    ? submissions 
    : submissions.filter(sub => sub.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock;
      case 'contacted': return Mail;
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return Trash2;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-red-600">Error loading submissions: {error}</p>
          <button 
            onClick={fetchSubmissions}
            className="mt-4 bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Submissions</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and booking requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Submissions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Submissions ({filteredSubmissions.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => {
                const StatusIcon = getStatusIcon(submission.status);
                return (
                  <div
                    key={submission.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                      selectedSubmission?.id === submission.id ? 'bg-blue-50 border-l-4 border-royal-blue' : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.full_name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(submission.status)}`}>
                            <StatusIcon className="h-3 w-3 inline mr-1" />
                            {submission.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {submission.phone}
                            </div>
                          )}
                          {submission.event_type && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {submission.event_type}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-2">
                          Submitted: {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmission(submission);
                          }}
                          className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(submission.id);
                          }}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600">
                  {statusFilter === 'all' 
                    ? 'No booking submissions yet.' 
                    : `No submissions with status "${statusFilter}".`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-1">
          {selectedSubmission ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => handleUpdateStatus(selectedSubmission.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-900">{selectedSubmission.full_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <a href={`mailto:${selectedSubmission.email}`} className="text-royal-blue hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </div>
                    {selectedSubmission.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                        <a href={`tel:${selectedSubmission.phone}`} className="text-royal-blue hover:underline">
                          {selectedSubmission.phone}
                        </a>
                      </div>
                    )}
                    {selectedSubmission.institution && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-900">{selectedSubmission.institution}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedSubmission.submission_type === 'booking' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                    <div className="space-y-2">
                      {selectedSubmission.event_type && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-900">{selectedSubmission.event_type}</span>
                        </div>
                      )}
                      {selectedSubmission.booking_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-900">
                            {new Date(selectedSubmission.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-900">{selectedSubmission.location}</span>
                        </div>
                      )}
                      {selectedSubmission.number_of_children && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-900">{selectedSubmission.number_of_children} children</span>
                        </div>
                      )}
                      {selectedSubmission.preferred_dates && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-900">Preferred: {selectedSubmission.preferred_dates}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(selectedSubmission.message || selectedSubmission.custom_needs) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedSubmission.message || selectedSubmission.custom_needs}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 text-gray-900 capitalize">{selectedSubmission.submission_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedSubmission.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedSubmission.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Submission</h3>
              <p className="text-gray-600">Choose a submission from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSubmissionsManager;