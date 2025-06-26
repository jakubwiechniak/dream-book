# Dokumentacja Pipeline'u Rezerwacji z Walidacją

## Przegląd

Zaktualizowano pipeline rezerwacji aby zawierał kompleksową walidację danych wprowadzanych przez użytkownika. System sprawdza poprawność wszystkich kluczowych pól w czasie rzeczywistym i podczas przechodzenia między krokami.

## Nowe Funkcje Walidacyjne

### 1. Walidacja Adresu Email (`validateEmail`)

- Sprawdza format email przy użyciu regex
- Wymaga poprawnej struktury: `user@domain.com`
- Zwraca błędy dla niepoprawnych formatów

### 2. Walidacja Numeru Telefonu (`validatePhone`)

- Obsługuje formaty krajowe i międzynarodowe
- Akceptuje: `(555) 123-4567`, `+48 123 456 789`
- Sprawdza długość (10-17 cyfr)
- Automatyczne formatowanie przy wprowadzaniu

### 3. Walidacja Karty Kredytowej (`validateCreditCard`)

- **Algorytm Luhn** - matematyczna weryfikacja poprawności numeru karty
- Obsługuje główne typy kart:
  - Visa (zaczyna się od 4)
  - Mastercard (5xxx lub 2xxx)
  - American Express (34xx, 37xx)
  - Discover (6011, 65xx)
  - Diners Club (30xx, 36xx, 38xx)
  - JCB (35xx)
- Sprawdza długość (13-19 cyfr)
- Automatyczne formatowanie podczas wprowadzania

### 4. Walidacja Daty Ważności (`validateExpiryDate`)

- Formaty: `MM/YY` lub `MM/YYYY`
- Sprawdza czy karta nie jest przeterminowana
- Weryfikuje rozsądne daty przyszłe (maksymalnie 20 lat)
- Automatyczne formatowanie z `/`

### 5. Walidacja CVV (`validateCVV`)

- 3 cyfry dla większości kart
- 4 cyfry dla American Express
- Inteligentna walidacja oparta na typie karty

### 6. Walidacja Imion i Nazwisk (`validateName`)

- Minimum 2 znaki
- Maksymalnie 50 znaków
- Tylko litery, spacje, myślniki i apostrofy
- Obsługa znaków międzynarodowych (À-ÿ)

### 7. Walidacja Posiadacza Karty (`validateCardholderName`)

- Podobnie jak imiona, ale akceptuje również kropki
- Maksymalnie 100 znaków (na kartach może być więcej tekstu)

## Formatowanie w Czasie Rzeczywistym

### Automatyczne Formatowanie Karty

```typescript
// Wejście: "4111111111111111"
// Wyjście: "4111 1111 1111 1111"

// American Express:
// Wejście: "378282246310005"
// Wyjście: "3782 822463 10005"
```

### Automatyczne Formatowanie Telefonu

```typescript
// Wejście: "5551234567"
// Wyjście: "(555) 123-4567"

// Z kodem kraju:
// Wejście: "15551234567"
// Wyjście: "+1 (555) 123-4567"
```

### Automatyczne Formatowanie Daty Ważności

```typescript
// Wejście: "1225"
// Wyjście: "12/25"
```

## Implementacja w Pipeline'ie

### Krok 1: Informacje o Gościu

- **Walidacja po stronie klienta**: Natychmiastowa weryfikacja przy wprowadzaniu
- **Walidacja po stronie serwera**: Dodatkowa weryfikacja przed przejściem do kroku 2
- **Pola**: Imię, Nazwisko, Email, Telefon

### Krok 2: Informacje o Płatności

- **Walidacja bezpieczeństwa**: Dane karty nie są wysyłane na serwer w kroku 2
- **Walidacja lokalna**: Wszystkie sprawdzenia odbywają się w przeglądarce
- **Szyfrowanie**: Informacja o bezpieczeństwie dla użytkownika
- **Pola**: Numer karty, Data ważności, CVV, Imię posiadacza

### Krok 3: Potwierdzenie i Finalizacja

- **Finalna walidacja**: Sprawdzenie wszystkich danych przed zapisem
- **Bezpieczne przesyłanie**: Dane karty są szyfrowane podczas finalnego przesyłania

## Obsługa Błędów

### Wyświetlanie Błędów

- Błędy pokazywane pod odpowiednimi polami
- Czerwone obramowanie dla pól z błędami
- Ogólne komunikaty błędów na górze formularza
- Ikony ostrzeżeń dla lepszej widoczności

### Typy Błędów

```typescript
interface ValidationError {
  field: string // np. "firstName", "cardNumber"
  message: string // Przyjazny komunikat dla użytkownika
}
```

### Przykładowe Komunikaty

- `"Invalid email format"` - Niepoprawny format email
- `"Phone number must be between 10-17 digits"` - Telefon za krótki/długi
- `"Invalid card number"` - Niepoprawny numer karty (algorytm Luhn)
- `"Card has expired"` - Karta przeterminowana
- `"CVV must be 3 digits"` - Niepoprawny CVV

## Bezpieczeństwo

### Zabezpieczenia Danych Karty

1. **Walidacja lokalna**: Numer karty sprawdzany tylko w przeglądarce w kroku 2
2. **Brak przechowywania**: Dane karty nie są zapisywane lokalnie
3. **Szyfrowane przesyłanie**: Bezpieczne API dla finalnej transakcji
4. **Informacje o bezpieczeństwie**: Komunikaty uspokajające użytkownika

### Walidacja Dwuetapowa

1. **Klient**: Szybka walidacja formatu i podstawowych reguł
2. **Serwer**: Dodatkowa weryfikacja i sprawdzenie dostępności

## Użycie w Kodzie

### Import

```typescript
import {
  validateBookingStep1,
  validateBookingStep2,
  formatCardNumber,
  formatPhoneNumber,
} from "@/lib/validation"
```

### Walidacja Kroku 1

```typescript
const result = validateBookingStep1({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "(555) 123-4567",
})

if (!result.isValid) {
  console.log(result.errors) // Array<ValidationError>
}
```

### Walidacja Kroku 2

```typescript
const result = validateBookingStep2({
  paymentMethod: "card",
  cardDetails: {
    number: "4111 1111 1111 1111",
    expiry: "12/25",
    cvv: "123",
    name: "John Doe",
  },
})
```

## Integracja z API

### Enhanced API Methods

- `reservationsAPI.bookingStep1()` - Walidacja danych osobowych
- `reservationsAPI.bookingStep2()` - Walidacja metody płatności
- `reservationsAPI.bookingStep3()` - Finalizacja rezerwacji

### Zwracane Dane

```typescript
interface ValidationResponse {
  valid: boolean
  errors?: ValidationError[]
  message?: string
}
```

## Testowanie

Utworzono kompleksowy zestaw testów sprawdzających:

- ✅ Poprawne formaty danych
- ✅ Niepoprawne formaty z odpowiednimi błędami
- ✅ Przypadki brzegowe (puste pola, za długie/krótkie wartości)
- ✅ Formatowanie w czasie rzeczywistym
- ✅ Integrację z komponentami React

Wszystkie funkcje walidacyjne zostały przetestowane i działają poprawnie.
