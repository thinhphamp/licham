# Code Standards - Lịch Việt

Comprehensive development guidelines for maintaining code quality, consistency, and maintainability across the Vietnamese Lunar Calendar app.

## TypeScript Standards

### Configuration
- **Strict Mode**: Enabled in tsconfig.json
  - `"strict": true` - All type checking flags enabled
  - `"noImplicitAny": true` - Variables require explicit types
  - `"strictNullChecks": true` - null/undefined handling required
  - `"strictFunctionTypes": true` - Function signature compatibility
  - `"strictBindCallApply": true` - bind/call/apply type checking
  - `"strictPropertyInitialization": true` - Properties must be initialized
  - `"noImplicitThis": true` - this context must be typed

### Path Aliases
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// Usage in files
import { useEventsStore } from '@/stores/eventStore';
import { getDayInfo } from '@/services/lunar';
import { Button } from '@/components/common/Button';
```

### Type Definitions

#### Interfaces vs Types
- **Use Interfaces** for:
  - Object shapes (components, data models)
  - External APIs and contracts
  - Things likely to be extended
  - Class implementations
  ```typescript
  interface LunarEvent {
    id: string;
    title: string;
    lunarDay: number;
    lunarMonth: number;
  }

  interface EventStore {
    events: LunarEvent[];
    addEvent: (data: EventFormData) => Promise<LunarEvent>;
  }
  ```

- **Use Types** for:
  - Union types and string literals
  - Function signatures (occasionally)
  - Mapped types and conditional types
  - Type aliases for primitives
  ```typescript
  type EventCategory = 'birthday' | 'ceremony' | 'holiday' | 'observance' | 'other';
  type AuspiciousLevel = 'very-good' | 'neutral' | 'bad';
  type DateString = string;  // ISO 8601 format
  ```

### Explicit Return Types
- **All public functions** must have explicit return types
- **All exported functions** must have explicit return types
- **Private/helper functions** can use inference if obvious
```typescript
// Good: Explicit return types
export function getDayInfo(date: Date): DayInfo {
  // ...
}

export async function addEvent(data: EventFormData): Promise<LunarEvent> {
  // ...
}

// Also good: Obvious inference on private helper
function calculateHash(str: string) {
  return str.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

// Bad: Public function missing return type
export function convertDate(solar) {
  // ...
}
```

### Generics
```typescript
// Generic interfaces for reusability
interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: string;
}

// Generic utility functions
function filterByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter((item) => item[key] === value);
}

// Usage
const events = filterByProperty(allEvents, 'category', 'birthday');
const lunarEvents = filterByProperty(allEvents, 'lunarMonth', 3);
```

## Component Standards

### Functional Components with Hooks
```typescript
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface DayCellProps {
  day: number;
  lunar: string;
  hasEvent: boolean;
  isHoliday: boolean;
  onPress: (day: number) => void;
}

export const DayCell: FC<DayCellProps> = ({
  day,
  lunar,
  hasEvent,
  isHoliday,
  onPress,
}) => {
  const theme = useTheme();
  const handlePress = useCallback(() => {
    onPress(day);
  }, [day, onPress]);

  const backgroundColor = useMemo(() => {
    if (isHoliday) return theme.colors.gold;
    if (hasEvent) return theme.colors.background;
    return theme.colors.white;
  }, [isHoliday, hasEvent, theme]);

  return (
    <View
      style={[
        styles.cell,
        { backgroundColor },
      ]}
      onTouchEnd={handlePress}
    >
      <Text style={styles.day}>{day}</Text>
      <Text style={styles.lunar}>{lunar}</Text>
    </View>
  );
};

DayCell.displayName = 'DayCell';
```

### Props Interfaces
- **Naming**: `{ComponentName}Props`
- **Structure**: Group related props together
- **Optional**: Mark optional props with `?`
- **Defaults**: Specify default values clearly
```typescript
interface EventFormProps {
  // Data
  initialEvent?: LunarEvent;
  eventId?: string;

  // Handlers
  onSave: (data: EventFormData) => Promise<void>;
  onCancel: () => void;

  // UI State
  isLoading?: boolean;
  error?: string;
}

interface AuspiciousHoursGridProps {
  lunarDay: number;
  compact?: boolean;  // Default: false
  showLabels?: boolean;  // Default: true
}
```

### Component Organization
```typescript
// 1. Imports (group by type)
import React, { FC, useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLunarDate } from '@/hooks/useLunarDate';
import { EventCard } from './EventCard';
import { Theme } from '@/constants/theme';

// 2. Types
interface EventListProps {
  lunarMonth: number;
  onSelectEvent: (eventId: string) => void;
}

// 3. Component
export const EventList: FC<EventListProps> = ({
  lunarMonth,
  onSelectEvent,
}) => {
  // Hooks
  const theme = useTheme();

  // Derived state
  const events = useEventsStore(s => s.events);

  // Callbacks
  const handleSelectEvent = useCallback((id: string) => {
    onSelectEvent(id);
  }, [onSelectEvent]);

  // Render
  return (
    <ScrollView>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={handleSelectEvent}
        />
      ))}
    </ScrollView>
  );
};

EventList.displayName = 'EventList';

// 4. Styles (at bottom)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### React.memo for Performance
```typescript
// Wrap components that receive the same props frequently
export const DayCell = React.memo<DayCellProps>(({
  day,
  lunar,
  hasEvent,
  isHoliday,
  onPress,
}) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison (optional)
  // Return true if props are equal (don't re-render)
  return (
    prevProps.day === nextProps.day &&
    prevProps.lunar === nextProps.lunar &&
    prevProps.hasEvent === nextProps.hasEvent
  );
});

DayCell.displayName = 'DayCell';
```

### Container vs Presentational Pattern
```typescript
// Container: Handles data, logic, state
const EventsContainer: FC = () => {
  const events = useEventsStore(s => s.events);
  const selectedMonth = useState(new Date().getMonth() + 1);

  const filteredEvents = useMemo(() => {
    return events.filter(e => e.lunarMonth === selectedMonth);
  }, [events, selectedMonth]);

  return (
    <EventsView
      events={filteredEvents}
      onSelectEvent={(id) => {
        // Navigate or handle
      }}
    />
  );
};

// Presentational: Renders UI, no data fetching
interface EventsViewProps {
  events: LunarEvent[];
  onSelectEvent: (id: string) => void;
}

const EventsView: FC<EventsViewProps> = ({ events, onSelectEvent }) => {
  return (
    <ScrollView>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onPress={() => onSelectEvent(event.id)}
        />
      ))}
    </ScrollView>
  );
};

export default EventsContainer;
```

## Styling Standards

### Pattern: StyleSheet + Dynamic Theme
```typescript
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});

export const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background },
    ]}>
      <Text style={[
        styles.header,
        { color: theme.colors.text },
      ]}>
        Title
      </Text>
      <Pressable style={[
        styles.button,
        { backgroundColor: theme.colors.primary },
      ]}>
        <Text style={{ color: theme.colors.white }}>
          Press me
        </Text>
      </Pressable>
    </View>
  );
};
```

### Color Palette
```typescript
// From constants/theme.ts
const colors = {
  // Primary branding
  primary: '#D4382A',      // Vietnamese red
  secondary: '#C4982E',    // Gold (prosperity)

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Neutral
  text: '#1F2937',         // Light theme
  textDark: '#F3F4F6',     // Dark theme
  background: '#FFFFFF',   // Light theme
  backgroundDark: '#111827', // Dark theme
  border: '#E5E7EB',       // Light theme
  borderDark: '#374151',   // Dark theme
};
```

### Spacing System
- **Base Unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80
- **Common usage**:
  - Margins/padding: 8, 12, 16, 20, 24
  - Component gap: 8, 12, 16
  - Section gap: 24, 32
  - Page padding: 16, 20, 24

```typescript
const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,  // Standard screen padding
  },
  sectionContainer: {
    marginBottom: 24,  // Space between sections
  },
  componentGap: {
    gap: 12,  // Space between child elements
  },
});
```

### Accessibility in Styling
```typescript
// Minimum touch target: 44x44 dp
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

// Color contrast: WCAG AA minimum
// Text: 4.5:1 ratio
// Large text (18pt+): 3:1 ratio
const theme = {
  // Good: High contrast
  text: '#000000',
  background: '#FFFFFF',
  // Also good
  text: '#FFFFFF',
  background: '#000000',
  // Bad: Low contrast
  text: '#777777',
  background: '#888888',
};
```

## State Management Standards

### Zustand Store Pattern
```typescript
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface EventState {
  // State
  events: LunarEvent[];

  // Sync actions (non-async)
  setEvents: (events: LunarEvent[]) => void;

  // Async actions
  addEvent: (data: EventFormData) => Promise<LunarEvent>;
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Queries (computed, no side effects)
  getEventsForLunarDate: (lunarDay: number, lunarMonth: number) => LunarEvent[];
}

export const useEventsStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],

      setEvents: (events) => {
        set({ events });
      },

      addEvent: async (data) => {
        const event: LunarEvent = {
          ...data,
          id: `event_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          events: [...state.events, event],
        }));

        return event;
      },

      deleteEvent: async (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      getEventsForLunarDate: (lunarDay, lunarMonth) => {
        return get().events.filter(
          (e) => e.lunarDay === lunarDay && e.lunarMonth === lunarMonth
        );
      },
    }),
    {
      name: 'events-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// Usage in components
const MyComponent = () => {
  const events = useEventsStore(s => s.events);
  const addEvent = useEventsStore(s => s.addEvent);

  const handleAdd = async () => {
    await addEvent({
      title: 'Event',
      lunarDay: 1,
      lunarMonth: 1,
      // ...
    });
  };
};
```

### Action Guidelines
- **Async actions** return Promises
- **Mutations** update state directly (Zustand batches updates)
- **Notifications** sync on event changes automatically
- **Error handling** in action implementations
```typescript
updateEvent: async (id, data) => {
  try {
    // Find and update event
    const events = get().events;
    const index = events.findIndex(e => e.id === id);

    if (index === -1) {
      throw new Error(`Event ${id} not found`);
    }

    const updatedEvent = { ...events[index], ...data };

    // Update notification if needed
    if (data.reminderEnabled !== undefined) {
      if (data.reminderEnabled) {
        const notifId = await scheduleEventNotification(updatedEvent);
        updatedEvent.notificationId = notifId;
      } else if (updatedEvent.notificationId) {
        await cancelNotification(updatedEvent.notificationId);
        updatedEvent.notificationId = undefined;
      }
    }

    // Update state
    const newEvents = [...events];
    newEvents[index] = updatedEvent;
    set({ events: newEvents });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}
```

## File Organization

### Directory Structure
```
src/
├── app/                   # Expo Router pages (one route = one file)
│   ├── _layout.tsx       # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx   # Tab navigation layout
│   │   ├── index.tsx     # Calendar tab
│   │   ├── events.tsx    # Events tab
│   │   └── settings.tsx  # Settings tab
│   ├── event/
│   │   ├── new.tsx       # Create event
│   │   └── [id].tsx      # Edit event
│   ├── day/
│   │   └── [date].tsx    # Day detail
│   └── +not-found.tsx    # 404 fallback
│
├── components/            # Reusable UI components
│   ├── calendar/         # Calendar-specific components
│   │   ├── CalendarView.tsx
│   │   ├── DayCell.tsx
│   │   ├── DayDetailModal.tsx
│   │   └── AuspiciousHoursGrid.tsx
│   ├── events/           # Event-specific components
│   │   ├── EventForm.tsx
│   │   ├── EventList.tsx
│   │   └── EventCard.tsx
│   └── common/           # Shared components
│       ├── Button.tsx
│       ├── Header.tsx
│       ├── Modal.tsx
│       └── AccessibleText.tsx
│
├── services/             # Business logic & algorithms
│   ├── lunar/           # Lunar calendar engine
│   │   ├── converter.ts  # Solar/lunar conversion
│   │   ├── canChi.ts     # Can-Chi calculations
│   │   ├── auspiciousHours.ts
│   │   ├── newMoon.ts    # Astronomical calculations
│   │   ├── types.ts
│   │   └── index.ts      # Public API
│   └── notifications/    # Push notifications
│       └── index.ts
│
├── stores/               # State management (Zustand)
│   ├── eventStore.ts
│   ├── settingsStore.ts
│   └── storage.ts        # MMKV adapter
│
├── hooks/                # Custom React hooks
│   ├── useLunarDate.ts
│   └── useAuspiciousHours.ts
│
├── constants/            # Static data & design system
│   ├── theme.ts
│   └── holidays.ts
│
├── types/                # TypeScript interfaces
│   └── event.ts
│
└── utils/                # Pure utility functions
    └── accessibility.ts
```

### Rules by Directory
- **app/**: Routes only, delegate to components/services
- **components/**: UI logic only, accept props, emit callbacks
- **services/**: Business logic only, no React dependencies
- **stores/**: State management, can call services/notifications
- **hooks/**: Custom hooks, can use stores/services
- **constants/**: No functions, static values only
- **types/**: Type/interface definitions only
- **utils/**: Pure functions, no side effects

## Naming Conventions

### Files
- **Routes**: Folder-based Expo Router syntax
  - `app/(tabs)/index.tsx` for Calendar tab
  - `app/event/new.tsx` for create event
  - `app/day/[date].tsx` for day detail
- **Components**: PascalCase.tsx
  - `Button.tsx`, `EventCard.tsx`, `CalendarView.tsx`
- **Services/hooks/utils**: camelCase.ts
  - `converter.ts`, `eventStore.ts`, `useLunarDate.ts`
- **Index files**: index.ts for public APIs
  - `src/services/lunar/index.ts` exports public functions

### Variables & Functions
```typescript
// Components: PascalCase
const MyComponent: FC = () => { };
export const EventCard = React.memo(({ ... }) => { });

// Hooks: use* prefix, camelCase
const useLunarDate = (date: Date) => { };
const useTheme = () => { };
const useEventsStore = create(...);

// Stores: *Store suffix
export const useEventsStore = create(...);
export const useSettingsStore = create(...);

// Regular functions: camelCase
function getDayInfo(date: Date): DayInfo { }
const convertDateToLunar = (solar: Date) => { };
const formatDate = (date: Date, format: string) => { };

// Constants: SCREAMING_SNAKE_CASE for compile-time constants
const TIMEZONE = 7;
const JULIAN_DAY_EPOCH = 1721425.5;

// Interfaces: PascalCase
interface EventFormData { }
interface LunarEvent extends EventFormData { }

// Private/internal: leading underscore (optional)
const _internalHelper = () => { };
interface _InternalState { }
```

### Semantic Naming
```typescript
// Good: Clear intent
const handleDatePress = (date: Date) => { };
const onEventCreated = (event: LunarEvent) => { };
const getEventsForLunarDate = (day, month) => { };

// Bad: Unclear
const handlePress = () => { };
const onEvent = () => { };
const getEvents = () => { };
```

## Code Quality Checklist

### Before Committing
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatted (`npm run format`)
- [ ] Components have proper TypeScript types
- [ ] Public functions have explicit return types
- [ ] Props interfaces follow naming convention
- [ ] Components use React.memo if necessary
- [ ] No hardcoded colors (use theme)
- [ ] Accessibility attributes (testID, accessibilityLabel)
- [ ] Error handling for async operations
- [ ] Comments for complex algorithms (lunar converter)

### Documentation
- [ ] Component has JSDoc comment block
- [ ] Complex functions documented with parameter descriptions
- [ ] Lunar service functions have algorithm references
- [ ] README updated if new features added

### Testing
- [ ] Unit tests for new utilities/services
- [ ] Component tests for new UI components
- [ ] Manual testing on iOS and Android
- [ ] Accessibility testing with screen reader

## Common Patterns

### Async Operations with Error Handling
```typescript
const handleSaveEvent = async () => {
  try {
    setLoading(true);
    setError(null);

    const event = await useEventsStore.getState().addEvent(formData);

    // Success feedback
    Alert.alert('Success', 'Event created');
    navigation.goBack();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
    Alert.alert('Error', 'Failed to create event');
  } finally {
    setLoading(false);
  }
};
```

### Conditional Rendering
```typescript
// Good: Early return
if (!events.length) {
  return <EmptyState />;
}

return (
  <FlatList
    data={events}
    renderItem={({ item }) => <EventCard event={item} />}
  />
);

// Also good: Ternary for single element
{isLoading ? <Spinner /> : <Content />}

// Avoid: Complex nested ternaries
```

### useCallback for Event Handlers
```typescript
const handlePress = useCallback(() => {
  onSelectDate(date);
}, [date, onSelectDate]);

return (
  <Pressable onPress={handlePress}>
    {/* ... */}
  </Pressable>
);
```

## Performance Best Practices

1. **Memoize expensive computations** with useMemo
2. **Memoize callbacks** with useCallback
3. **Use React.memo** for components receiving stable props
4. **Lazy load** images and heavy components
5. **Avoid creating objects/functions in render**
6. **Use FlatList** instead of ScrollView for long lists
7. **Profile with React DevTools Profiler**

## Recent Implementation Patterns

### Responsive Calendar Navigation (CalendarView.tsx)
- Year/month selector grid modal for quick date navigation
- Responsive header with selectable year and month
- Maintains consistency with existing design patterns
- Uses Zustand for state management

### Settings UI with Time Picker (settings.tsx)
- Editable reminder settings with numeric input (days before)
- Time picker modal for selecting reminder time
- Global settings store integration
- Settings apply as defaults to new events
- Pattern: Settings page → Settings store → Event defaults

## Related Documentation

- See [System Architecture](system-architecture.md) for data flow patterns
- See [Codebase Summary](codebase-summary.md) for module organization
- See [Project Overview](project-overview-pdr.md) for feature specifications
