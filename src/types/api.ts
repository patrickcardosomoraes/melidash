// API Configuration Types
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

// Request/Response Types
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: Record<string, unknown>;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

// Mercado Livre OAuth Types
export interface MLAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface MLTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  user_id: number;
}

export interface MLTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  userId: number;
  scope: string[];
}

// Webhook Types
export interface MLWebhook {
  id: string;
  topic: string;
  resource: string;
  user_id: number;
  application_id: number;
  attempts: number;
  sent: string;
  received: string;
}

export interface WebhookPayload {
  _id: string;
  topic: 'items' | 'orders' | 'questions' | 'claims' | 'messages';
  resource: string;
  user_id: number;
  application_id: number;
  attempts: number;
  sent: string;
  received: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  stockRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Rate Limiting Types
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

// Cache Types
export interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'ttl';
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
  accessCount: number;
}

// Queue Types
export interface QueueJob {
  id: string;
  type: string;
  data: Record<string, unknown>;
  priority: number;
  attempts: number;
  maxAttempts: number;
  delay?: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface QueueConfig {
  concurrency: number;
  maxAttempts: number;
  backoff: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete: number;
  removeOnFail: number;
}

// Mercado Livre API Types
export interface MLUser {
  id: number;
  nickname: string;
  registrationDate: string;
  firstName: string;
  lastName: string;
  countryId: string;
  email: string;
  identification: {
    number: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: {
    areaCode: string;
    number: string;
    extension?: string;
    verified: boolean;
  };
  alternativePhone: {
    areaCode: string;
    number: string;
    extension?: string;
  };
  userType: 'normal' | 'brand' | 'classified';
  tags: string[];
  logo?: string;
  points: number;
  siteId: string;
  permalink: string;
  sellerReputation: {
    powerSellerStatus: string;
    levelId: string;
    transactions: {
      period: string;
      total: number;
      completed: number;
      canceled: number;
      ratings: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
  };
  buyerReputation: {
    tags: string[];
  };
  status: {
    siteStatus: string;
    mercadopagoAccountType: string;
    mercadopagoTcAccepted: boolean;
    mercadolibreAccountType: string;
    userType: string;
    confirmed: boolean;
  };
}

export interface MLProduct {
  id: string;
  title: string;
  subtitle?: string;
  categoryId: string;
  price: number;
  basePrice: number;
  originalPrice?: number;
  currencyId: string;
  initialQuantity: number;
  availableQuantity: number;
  soldQuantity: number;
  condition: 'new' | 'used' | 'not_specified';
  permalink: string;
  thumbnailId: string;
  thumbnail: string;
  secureThumbnail: string;
  pictures: Array<{
    id: string;
    url: string;
    secureUrl: string;
    size: string;
    maxSize: string;
  }>;
  videoId?: string;
  descriptions: Array<{
    id: string;
  }>;
  acceptsMercadopago: boolean;
  nonMercadopagoPaymentMethods: Record<string, unknown>[];
  shipping: {
    mode: string;
    methods: Record<string, unknown>[];
    tags: string[];
    dimensions?: string;
    localPickUp: boolean;
    freeShipping: boolean;
    logisticType: string;
    storePickUp: boolean;
  };
  internationalDeliveryMode: string;
  sellerAddress: {
    city: {
      id: string;
      name: string;
    };
    state: {
      id: string;
      name: string;
    };
    country: {
      id: string;
      name: string;
    };
    searchLocation: {
      neighborhood: {
        id: string;
        name: string;
      };
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
    };
    id: number;
  };
  sellerContact?: Record<string, unknown>;
  location: Record<string, unknown>;
  attributes: Array<{
    id: string;
    name: string;
    valueId?: string;
    valueName?: string;
    valueStruct?: Record<string, unknown>;
    values: Array<{
      id?: string;
      name?: string;
      struct?: Record<string, unknown>;
    }>;
    attributeGroupId: string;
    attributeGroupName: string;
  }>;
  warnings: Record<string, unknown>[];
  listingSource: string;
  variations: Array<{
    id: number;
    price: number;
    attributeCombinations: Array<{
      id: string;
      name: string;
      valueId: string;
      valueName: string;
    }>;
    availableQuantity: number;
    soldQuantity: number;
    pictureIds: string[];
  }>;
  status: 'active' | 'paused' | 'closed' | 'under_review' | 'inactive';
  subStatus: string[];
  tags: string[];
  warranty: string;
  catalogProductId?: string;
  domainId: string;
  parentItemId?: string;
  differentialPricing?: Record<string, unknown>;
  dealIds: string[];
  automaticRelist: boolean;
  dateCreated: string;
  lastUpdated: string;
  health?: number;
  catalogListing?: boolean;
  channels: string[];
}

export interface MLOrder {
  id: number;
  dateCreated: string;
  dateLastUpdated: string;
  mediations: Record<string, unknown>[];
  fulfillment: {
    id: number;
    shipmentId: number;
  };
  shipping: {
    id: number;
    shipmentType: string;
    dateCreated: string;
    lastUpdated: string;
    mode: string;
    pickupId?: number;
    status: string;
    substatus?: string;
    items: Array<{
      id: string;
      description: string;
    }>;
    dateFirstPrinted?: string;
    marketPlace: string;
    serviceId?: number;
    carrierId?: number;
    sendingDate?: string;
    receivingDate?: string;
    receiverAddress: {
      id: number;
      addressLine: string;
      streetName: string;
      streetNumber: string;
      comment: string;
      zipCode: string;
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      country: {
        id: string;
        name: string;
      };
      neighborhood: {
        id: string;
        name: string;
      };
      municipality: {
        id: string;
        name: string;
      };
      agencyId?: string;
      types: string[];
      latitude?: number;
      longitude?: number;
      receiverName: string;
      receiverPhone: string;
    };
  };
  status: 'confirmed' | 'payment_required' | 'payment_in_process' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  statusDetail?: string;
  tags: string[];
  buyer: {
    id: number;
    nickname: string;
    email: string;
    phone: {
      areaCode: string;
      number: string;
      extension?: string;
      verified: boolean;
    };
    alternativePhone: {
      areaCode: string;
      number: string;
      extension?: string;
    };
    firstName: string;
    lastName: string;
    billingInfo: {
      docType: string;
      docNumber: string;
    };
  };
  seller: {
    id: number;
    nickname: string;
    email: string;
    phone: {
      areaCode: string;
      number: string;
      extension?: string;
      verified: boolean;
    };
    alternativePhone: {
      areaCode: string;
      number: string;
      extension?: string;
    };
    firstName: string;
    lastName: string;
  };
  payments: Array<{
    id: number;
    transactionAmount: number;
    currencyId: string;
    status: string;
    dateCreated: string;
    dateLastUpdated: string;
  }>;
  feedback: {
    buyer?: Record<string, unknown>;
    seller?: Record<string, unknown>;
  };
  context: {
    channel: string;
    site: string;
    flows: string[];
  };
  orderItems: Array<{
    item: {
      id: string;
      title: string;
      categoryId: string;
      variationId?: number;
      sellerId: number;
      variationAttributes: Record<string, unknown>[];
    };
    quantity: number;
    unitPrice: number;
    fullUnitPrice: number;
    currencyId: string;
    manufacturingDays?: number;
    saleTerms: Record<string, unknown>[];
  }>;
  currencyId: string;
  orderRequest: {
    return?: Record<string, unknown>;
    change?: Record<string, unknown>;
  };
  expiredDate: string;
  orderType: string;
  manufacturingEndingDate?: string;
  pack: {
    id: number;
    mode: string;
  };
  totalAmount: number;
}

export interface MLQuestion {
  id: number;
  text: string;
  status: 'UNANSWERED' | 'ANSWERED' | 'CLOSED_UNANSWERED' | 'UNDER_REVIEW';
  dateCreated: string;
  itemId: string;
  sellerId: number;
  deletedFromListing: boolean;
  hold: boolean;
  from: {
    id: number;
    answeredQuestions: number;
  };
  answer?: {
    text: string;
    status: 'ACTIVE' | 'DISABLED';
    dateCreated: string;
  };
}