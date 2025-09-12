'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Mail, 
  User, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock,
  UserX
} from 'lucide-react';

interface Invitation {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expires_at: string;
  created_at: string;
  accepted_at?: string;
  invited_by_name: string;
  invited_by_email: string;
}

interface InviteFormData {
  email: string;
  expiresInDays: number;
}

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState('');
  
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    expiresInDays: 7
  });

  useEffect(() => {
    fetchInvites();
  }, [statusFilter]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/admin/invites?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setInvites(data.data.invites);
      } else {
        setError(data.error || 'Erro ao carregar convites');
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return;
    }
    
    setCreatingInvite(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Convite criado com sucesso para ${formData.email}`);
        setFormData({ email: '', expiresInDays: 7 });
        setShowCreateDialog(false);
        fetchInvites(); // Refresh the list
        
        // Show the invite URL for copying
        if (data.data.inviteUrl) {
          setCopiedUrl(data.data.inviteUrl);
        }
      } else {
        setError(data.error || 'Erro ao criar convite');
      }
    } catch (error) {
      console.error('Error creating invite:', error);
      setError('Erro de conexão');
    } finally {
      setCreatingInvite(false);
    }
  };

  const handleUpdateInviteStatus = async (inviteId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/invites', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: inviteId, status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Status do convite atualizado para ${newStatus}`);
        fetchInvites(); // Refresh the list
      } else {
        setError(data.error || 'Erro ao atualizar convite');
      }
    } catch (error) {
      console.error('Error updating invite:', error);
      setError('Erro de conexão');
    }
  };

  const copyInviteUrl = async (token: string) => {
    const inviteUrl = `${window.location.origin}/register?token=${token}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedUrl(inviteUrl);
      setTimeout(() => setCopiedUrl(''), 3000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      ACCEPTED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      EXPIRED: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      REVOKED: { color: 'bg-red-100 text-red-800', icon: UserX },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    
    return (
      <Badge className={`${config?.color} flex items-center gap-1`}>
        <Icon size={12} />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gerenciar Convites
        </h1>
        <p className="text-gray-600">
          Gerencie convites para novos usuários do sistema
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Convite</DialogTitle>
              <DialogDescription>
                Envie um convite para um novo usuário se juntar ao sistema
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateInvite} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email do Convidado
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@exemplo.com"
                  required
                  disabled={creatingInvite}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expiresInDays" className="text-sm font-medium">
                  Expira em (dias)
                </label>
                <Select 
                  value={formData.expiresInDays.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, expiresInDays: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  disabled={creatingInvite}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={creatingInvite}>
                  {creatingInvite ? 'Criando...' : 'Criar Convite'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="ACCEPTED">Aceitos</SelectItem>
            <SelectItem value="EXPIRED">Expirados</SelectItem>
            <SelectItem value="REVOKED">Revogados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}
      
      {copiedUrl && (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Copy className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            URL do convite copiada: <code className="text-xs bg-blue-100 px-1 rounded">{copiedUrl}</code>
          </AlertDescription>
        </Alert>
      )}

      {/* Invites Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail size={20} />
            Convites ({invites.length})
          </CardTitle>
          <CardDescription>
            Lista de todos os convites enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando convites...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum convite encontrado</p>
              <p className="text-sm text-gray-500 mt-2">
                Clique em &quot;Novo Convite&quot; para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Convidado por</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">
                        {invite.email}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invite.status)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(invite.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(invite.expires_at)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {invite.invited_by_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {invite.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyInviteUrl('mock-token-' + invite.id)}
                                className="flex items-center gap-1"
                              >
                                <Copy size={12} />
                                Copiar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateInviteStatus(invite.id, 'REVOKED')}
                              >
                                Revogar
                              </Button>
                            </>
                          )}
                          {invite.status === 'REVOKED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateInviteStatus(invite.id, 'PENDING')}
                            >
                              Reativar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}