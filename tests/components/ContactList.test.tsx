import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import ContactList from '@/components/ContactList';

// Mock Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock contacts service
jest.mock('@/services/contact.service', () => ({
    addContact: jest.fn(),
    updateContact: jest.fn(),
    deleteContact: jest.fn(),
    searchContacts: jest.fn(),
}));

// Mock contacts hook
jest.mock('@/hooks/useContacts', () => ({
    useContacts: () => ({
        contacts: [
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
        ],
        isLoading: false,
        error: null,
    }),
}));

// Mock i18n
jest.mock('next-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}));

const mockPush = jest.fn();
const mockRouter = {
    push: mockPush,
    pathname: '/contacts',
    query: {},
    asPath: '/contacts',
};

describe('ContactList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('should render contacts list header', () => {
        render(<ContactList />);

        expect(screen.getByText(/contacts/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /add contact/i })
        ).toBeInTheDocument();
    });

    it('should render all contacts', () => {
        render(<ContactList />);

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.getByText(/bob johnson/i)).toBeInTheDocument();
        expect(screen.getByText(/alice brown/i)).toBeInTheDocument();
    });

    it('should display contact information', () => {
        render(<ContactList />);

        expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/\+1234567890/i)).toBeInTheDocument();
        expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/\+0987654321/i)).toBeInTheDocument();
    });

    it('should show favorite contacts first', () => {
        render(<ContactList />);

        const contactItems = screen.getAllByTestId('contact-item');
        expect(contactItems[0]).toHaveTextContent('Jane Smith');
        expect(contactItems[1]).toHaveTextContent('Alice Brown');
        expect(contactItems[2]).toHaveTextContent('Bob Johnson');
    });

    it('should show favorite star for favorite contacts', () => {
        render(<ContactList />);

        const favoriteStars = screen.getAllByTestId('favorite-star');
        expect(favoriteStars).toHaveLength(2);
    });

    it('should show loading state when contacts are loading', () => {
        const mockUseContacts = require('@/hooks/useContacts').useContacts;
        mockUseContacts.mockReturnValue({
            contacts: [],
            isLoading: true,
            error: null,
        });

        render(<ContactList />);

        expect(screen.getByText(/loading contacts/i)).toBeInTheDocument();
    });

    it('should show error message when contacts fail to load', () => {
        const mockUseContacts = require('@/hooks/useContacts').useContacts;
        mockUseContacts.mockReturnValue({
            contacts: [],
            isLoading: false,
            error: 'Failed to load contacts',
        });

        render(<ContactList />);

        expect(
            screen.getByText(/failed to load contacts/i)
        ).toBeInTheDocument();
    });

    it('should show empty state when no contacts exist', () => {
        const mockUseContacts = require('@/hooks/useContacts').useContacts;
        mockUseContacts.mockReturnValue({
            contacts: [],
            isLoading: false,
            error: null,
        });

        render(<ContactList />);

        expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument();
        expect(
            screen.getByText(/add your first contact to get started/i)
        ).toBeInTheDocument();
    });

    it('should open add contact modal when add contact button is clicked', () => {
        render(<ContactList />);

        const addButton = screen.getByRole('button', { name: /add contact/i });
        fireEvent.click(addButton);

        expect(screen.getByText(/add new contact/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('should add new contact successfully', async () => {
        const mockAddContact = require('@/services/contact.service').addContact;
        mockAddContact.mockResolvedValue({
            success: true,
            contact: { id: '4', name: 'New Contact' },
        });

        render(<ContactList />);

        const addButton = screen.getByRole('button', { name: /add contact/i });
        fireEvent.click(addButton);

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const phoneInput = screen.getByLabelText(/phone/i);
        const saveButton = screen.getByRole('button', { name: /save/i });

        fireEvent.change(nameInput, { target: { value: 'New Contact' } });
        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(phoneInput, { target: { value: '+9999999999' } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockAddContact).toHaveBeenCalledWith({
                name: 'New Contact',
                email: 'new@example.com',
                phone: '+9999999999',
            });
            expect(
                screen.getByText(/contact added successfully/i)
            ).toBeInTheDocument();
        });
    });

    it('should show validation errors for empty contact form', async () => {
        render(<ContactList />);

        const addButton = screen.getByRole('button', { name: /add contact/i });
        fireEvent.click(addButton);

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid email format', async () => {
        render(<ContactList />);

        const addButton = screen.getByRole('button', { name: /add contact/i });
        fireEvent.click(addButton);

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const saveButton = screen.getByRole('button', { name: /save/i });

        fireEvent.change(nameInput, { target: { value: 'Test Contact' } });
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(
                screen.getByText(/invalid email format/i)
            ).toBeInTheDocument();
        });
    });

    it('should search contacts by name', () => {
        render(<ContactList />);

        const searchInput = screen.getByPlaceholderText(/search contacts/i);
        fireEvent.change(searchInput, { target: { value: 'jane' } });

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/alice brown/i)).not.toBeInTheDocument();
    });

    it('should search contacts by email', () => {
        render(<ContactList />);

        const searchInput = screen.getByPlaceholderText(/search contacts/i);
        fireEvent.change(searchInput, { target: { value: 'bob@example.com' } });

        expect(screen.getByText(/bob johnson/i)).toBeInTheDocument();
        expect(screen.queryByText(/jane smith/i)).not.toBeInTheDocument();
    });

    it('should search contacts by phone', () => {
        render(<ContactList />);

        const searchInput = screen.getByPlaceholderText(/search contacts/i);
        fireEvent.change(searchInput, { target: { value: '1234567890' } });

        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument();
    });

    it('should toggle favorite status when star is clicked', async () => {
        const mockUpdateContact =
            require('@/services/contact.service').updateContact;
        mockUpdateContact.mockResolvedValue({ success: true });

        render(<ContactList />);

        const favoriteStars = screen.getAllByTestId('favorite-star');
        fireEvent.click(favoriteStars[1]); // Click Bob's star (not favorite)

        await waitFor(() => {
            expect(mockUpdateContact).toHaveBeenCalledWith('2', {
                isFavorite: true,
            });
        });
    });

    it('should open edit contact modal when edit button is clicked', () => {
        render(<ContactList />);

        const editButtons = screen.getAllByRole('button', { name: /edit/i });
        fireEvent.click(editButtons[0]);

        expect(screen.getByText(/edit contact/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/jane smith/i)).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(/jane@example.com/i)
        ).toBeInTheDocument();
    });

    it('should update contact successfully', async () => {
        const mockUpdateContact =
            require('@/services/contact.service').updateContact;
        mockUpdateContact.mockResolvedValue({ success: true });

        render(<ContactList />);

        const editButtons = screen.getAllByRole('button', { name: /edit/i });
        fireEvent.click(editButtons[0]);

        const nameInput = screen.getByDisplayValue(/jane smith/i);
        const saveButton = screen.getByRole('button', { name: /save/i });

        fireEvent.change(nameInput, {
            target: { value: 'Jane Smith Updated' },
        });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateContact).toHaveBeenCalledWith('1', {
                name: 'Jane Smith Updated',
                email: 'jane@example.com',
                phone: '+1234567890',
            });
            expect(
                screen.getByText(/contact updated successfully/i)
            ).toBeInTheDocument();
        });
    });

    it('should delete contact when delete button is clicked', async () => {
        const mockDeleteContact =
            require('@/services/contact.service').deleteContact;
        mockDeleteContact.mockResolvedValue({ success: true });

        render(<ContactList />);

        const deleteButtons = screen.getAllByRole('button', {
            name: /delete/i,
        });
        fireEvent.click(deleteButtons[0]);

        expect(
            screen.getByText(/are you sure you want to delete this contact/i)
        ).toBeInTheDocument();

        const confirmButton = screen.getByRole('button', {
            name: /confirm delete/i,
        });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteContact).toHaveBeenCalledWith('1');
            expect(
                screen.getByText(/contact deleted successfully/i)
            ).toBeInTheDocument();
        });
    });

    it('should send money to contact when send money button is clicked', () => {
        render(<ContactList />);

        const sendButtons = screen.getAllByRole('button', {
            name: /send money/i,
        });
        fireEvent.click(sendButtons[0]);

        expect(mockPush).toHaveBeenCalledWith(
            '/send?recipient=jane@example.com'
        );
    });

    it('should show last transaction date', () => {
        render(<ContactList />);

        expect(
            screen.getByText(/last sent: jan 15, 2024/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/last sent: jan 14, 2024/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/last sent: jan 13, 2024/i)
        ).toBeInTheDocument();
    });

    it('should sort contacts alphabetically when sort option is changed', () => {
        render(<ContactList />);

        const sortSelect = screen.getByLabelText(/sort by/i);
        fireEvent.change(sortSelect, { target: { value: 'name' } });

        const contactItems = screen.getAllByTestId('contact-item');
        expect(contactItems[0]).toHaveTextContent('Alice Brown');
        expect(contactItems[1]).toHaveTextContent('Bob Johnson');
        expect(contactItems[2]).toHaveTextContent('Jane Smith');
    });

    it('should show contact count', () => {
        render(<ContactList />);

        expect(screen.getByText(/3 contacts/i)).toBeInTheDocument();
    });

    it('should close modal when cancel button is clicked', () => {
        render(<ContactList />);

        const addButton = screen.getByRole('button', { name: /add contact/i });
        fireEvent.click(addButton);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(screen.queryByText(/add new contact/i)).not.toBeInTheDocument();
    });

    it('should handle contact service errors gracefully', async () => {
        const mockAddContact = require('@/services/contact.service').addContact;
        mockAddContact.mockResolvedValue({
            success: false,
            error: 'Contact already exists',
        });

        render(<ContactList />);

        const addButton = screen.getByRole('button', { name: /add contact/i });
        fireEvent.click(addButton);

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const phoneInput = screen.getByLabelText(/phone/i);
        const saveButton = screen.getByRole('button', { name: /save/i });

        fireEvent.change(nameInput, { target: { value: 'Test Contact' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(phoneInput, { target: { value: '+9999999999' } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(
                screen.getByText(/contact already exists/i)
            ).toBeInTheDocument();
        });
    });
});
