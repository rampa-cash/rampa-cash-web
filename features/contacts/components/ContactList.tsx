import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    isFavorite: boolean;
    lastTransaction?: string;
}

// Mock contacts data - in real app this would come from contacts hook
const mockContacts: Contact[] = [
    {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        isFavorite: true,
        lastTransaction: '2024-01-15T10:30:00Z',
    },
    {
        id: '2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+0987654321',
        isFavorite: false,
        lastTransaction: '2024-01-14T15:45:00Z',
    },
    {
        id: '3',
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '+1122334455',
        isFavorite: true,
        lastTransaction: '2024-01-13T09:15:00Z',
    },
];

export const ContactList = (): JSX.Element => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contacts, setContacts] = useState<Contact[]>(mockContacts);
    const [filteredContacts, setFilteredContacts] =
        useState<Contact[]>(mockContacts);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('favorite');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(
        null
    );
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        email: '',
        phone: '',
        isFavorite: false,
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        let filtered = [...contacts];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                contact =>
                    contact.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    contact.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    contact.phone.includes(searchTerm)
            );
        }

        // Sort contacts
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'favorite':
                    if (a.isFavorite && !b.isFavorite) return -1;
                    if (!a.isFavorite && b.isFavorite) return 1;
                    return a.name.localeCompare(b.name);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    const aDate = a.lastTransaction
                        ? new Date(a.lastTransaction).getTime()
                        : 0;
                    const bDate = b.lastTransaction
                        ? new Date(b.lastTransaction).getTime()
                        : 0;
                    return bDate - aDate;
                default:
                    return 0;
            }
        });

        setFilteredContacts(filtered);
    }, [contacts, searchTerm, sortBy]);

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name) {
            newErrors.name = t('contacts.form.validation.nameRequired');
        }

        if (!formData.email) {
            newErrors.email = t('contacts.form.validation.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('contacts.form.validation.emailInvalid');
        }

        if (!formData.phone) {
            newErrors.phone = t('contacts.form.validation.phoneRequired');
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = t('contacts.form.validation.phoneInvalid');
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement actual add contact logic
            const newContact: Contact = {
                id: Date.now().toString(),
                name: formData.name!,
                email: formData.email!,
                phone: formData.phone!,
                isFavorite: formData.isFavorite || false,
            };

            setContacts(prev => [...prev, newContact]);
            setShowAddModal(false);
            setFormData({ name: '', email: '', phone: '', isFavorite: false });
        } catch (error) {
            console.error('Add contact error:', error);
            setError(t('contacts.error.add'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditContact = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !selectedContact) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement actual edit contact logic
            const updatedContact: Contact = {
                ...selectedContact,
                name: formData.name!,
                email: formData.email!,
                phone: formData.phone!,
                isFavorite: formData.isFavorite || false,
            };

            setContacts(prev =>
                prev.map(contact =>
                    contact.id === selectedContact.id ? updatedContact : contact
                )
            );
            setShowEditModal(false);
            setSelectedContact(null);
            setFormData({ name: '', email: '', phone: '', isFavorite: false });
        } catch (error) {
            console.error('Edit contact error:', error);
            setError(t('contacts.error.edit'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteContact = async () => {
        if (!selectedContact) return;

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement actual delete contact logic
            setContacts(prev =>
                prev.filter(contact => contact.id !== selectedContact.id)
            );
            setShowDeleteModal(false);
            setSelectedContact(null);
        } catch (error) {
            console.error('Delete contact error:', error);
            setError(t('contacts.error.delete'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFavorite = async (contact: Contact) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement actual toggle favorite logic
            setContacts(prev =>
                prev.map(c =>
                    c.id === contact.id
                        ? { ...c, isFavorite: !c.isFavorite }
                        : c
                )
            );
        } catch (error) {
            console.error('Toggle favorite error:', error);
            setError(t('contacts.error.toggleFavorite'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMoney = (contact: Contact) => {
        router.push(`/transactions/send?recipient=${contact.email}`);
    };

    const openEditModal = (contact: Contact) => {
        setSelectedContact(contact);
        setFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            isFavorite: contact.isFavorite,
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (contact: Contact) => {
        setSelectedContact(contact);
        setShowDeleteModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.back()}
                                className="mr-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {t('contacts.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                            >
                                {t('contacts.addContact')}
                            </button>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label
                                htmlFor="search"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('contacts.search.label')}
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={t('contacts.search.placeholder')}
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label
                                htmlFor="sortBy"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t('contacts.sort.label')}
                            </label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="favorite">
                                    {t('contacts.sort.favorite')}
                                </option>
                                <option value="name">
                                    {t('contacts.sort.name')}
                                </option>
                                <option value="date">
                                    {t('contacts.sort.date')}
                                </option>
                            </select>
                        </div>

                        {/* Contact Count */}
                        <div className="flex items-end">
                            <p className="text-sm text-gray-500">
                                {filteredContacts.length} {t('contacts.count')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* Contacts List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">
                                {t('contacts.loading')}
                            </p>
                        </div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-4">
                                {t('contacts.noContacts')}
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                            >
                                {t('contacts.addFirstContact')}
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    data-testid="contact-item"
                                    className="p-6 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium text-lg">
                                                    {contact.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {contact.name}
                                                    </p>
                                                    {contact.isFavorite && (
                                                        <svg
                                                            data-testid="favorite-star"
                                                            className="w-4 h-4 text-yellow-400"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {contact.email}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {contact.phone}
                                                </p>
                                                {contact.lastTransaction && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {t('contacts.lastSent')}
                                                        :{' '}
                                                        {formatDate(
                                                            contact.lastTransaction
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleSendMoney(contact)
                                                }
                                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                                            >
                                                {t('contacts.sendMoney')}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleToggleFavorite(
                                                        contact
                                                    )
                                                }
                                                className="text-gray-400 hover:text-yellow-500"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill={
                                                        contact.isFavorite
                                                            ? 'currentColor'
                                                            : 'none'
                                                    }
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openEditModal(contact)
                                                }
                                                className="text-gray-400 hover:text-indigo-500"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(contact)
                                                }
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Contact Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('contacts.addContact')}
                            </h3>

                            <form
                                onSubmit={handleAddContact}
                                className="space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {t('contacts.form.name')}
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            formErrors.name
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder={t(
                                            'contacts.form.namePlaceholder'
                                        )}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {t('contacts.form.email')}
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            formErrors.email
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder={t(
                                            'contacts.form.emailPlaceholder'
                                        )}
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {t('contacts.form.phone')}
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            formErrors.phone
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder={t(
                                            'contacts.form.phonePlaceholder'
                                        )}
                                    />
                                    {formErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="isFavorite"
                                        name="isFavorite"
                                        type="checkbox"
                                        checked={formData.isFavorite || false}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="isFavorite"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        {t('contacts.form.favorite')}
                                    </label>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        {t('contacts.form.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? t('contacts.form.saving')
                                            : t('contacts.form.save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Contact Modal */}
            {showEditModal && selectedContact && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('contacts.editContact')}
                            </h3>

                            <form
                                onSubmit={handleEditContact}
                                className="space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="edit-name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {t('contacts.form.name')}
                                    </label>
                                    <input
                                        id="edit-name"
                                        name="name"
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            formErrors.name
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder={t(
                                            'contacts.form.namePlaceholder'
                                        )}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {t('contacts.form.email')}
                                    </label>
                                    <input
                                        id="edit-email"
                                        name="email"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            formErrors.email
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder={t(
                                            'contacts.form.emailPlaceholder'
                                        )}
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-phone"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {t('contacts.form.phone')}
                                    </label>
                                    <input
                                        id="edit-phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            formErrors.phone
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder={t(
                                            'contacts.form.phonePlaceholder'
                                        )}
                                    />
                                    {formErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {formErrors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="edit-isFavorite"
                                        name="isFavorite"
                                        type="checkbox"
                                        checked={formData.isFavorite || false}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="edit-isFavorite"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        {t('contacts.form.favorite')}
                                    </label>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        {t('contacts.form.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? t('contacts.form.saving')
                                            : t('contacts.form.save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedContact && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('contacts.deleteTitle')}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {t('contacts.deleteMessage', {
                                    name: selectedContact.name,
                                })}
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    {t('contacts.form.cancel')}
                                </button>
                                <button
                                    onClick={handleDeleteContact}
                                    disabled={isLoading}
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isLoading
                                        ? t('contacts.form.deleting')
                                        : t('contacts.confirmDelete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
