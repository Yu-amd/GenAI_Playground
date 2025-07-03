#!/usr/bin/env python3
"""
GenAI Playground - Infrastructure Performance Charts Generator
Generates PNG charts from the simulation data
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import seaborn as sns
from datetime import datetime, timedelta
import pandas as pd

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

def create_hourly_traffic_chart():
    """Create hourly traffic pattern chart"""
    hours = list(range(24))
    traffic = [25, 15, 10, 8, 12, 45, 120, 180, 220, 280, 260, 200, 
               160, 140, 120, 100, 85, 70, 60, 50, 40, 35, 30, 25]
    gpu_util = [5, 3, 2, 1, 2, 8, 25, 45, 65, 92, 88, 75, 
                60, 50, 40, 35, 30, 25, 20, 15, 12, 10, 8, 6]
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # Traffic chart
    ax1.plot(hours, traffic, 'o-', linewidth=2, markersize=6, color='#2563eb')
    ax1.fill_between(hours, traffic, alpha=0.3, color='#2563eb')
    ax1.set_title('Hourly Traffic Pattern (Average Day)', fontsize=16, fontweight='bold')
    ax1.set_ylabel('Traffic (RPS)', fontsize=12)
    ax1.set_xlabel('Hour of Day', fontsize=12)
    ax1.grid(True, alpha=0.3)
    ax1.set_xticks(hours[::2])
    
    # GPU utilization chart
    ax2.plot(hours, gpu_util, 'o-', linewidth=2, markersize=6, color='#dc2626')
    ax2.fill_between(hours, gpu_util, alpha=0.3, color='#dc2626')
    ax2.set_title('GPU Utilization - MI355X Nodes', fontsize=16, fontweight='bold')
    ax2.set_ylabel('Utilization (%)', fontsize=12)
    ax2.set_xlabel('Hour of Day', fontsize=12)
    ax2.grid(True, alpha=0.3)
    ax2.set_xticks(hours[::2])
    
    plt.tight_layout()
    plt.savefig('hourly_traffic_pattern.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_weekly_traffic_chart():
    """Create weekly traffic pattern chart"""
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    avg_rps = [172, 168, 165, 170, 145, 98, 85]
    peak_rps = [280, 275, 270, 285, 240, 160, 140]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    x = np.arange(len(days))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, avg_rps, width, label='Average RPS', color='#2563eb', alpha=0.8)
    bars2 = ax.bar(x + width/2, peak_rps, width, label='Peak RPS', color='#dc2626', alpha=0.8)
    
    ax.set_title('Weekly Traffic Pattern (30 Days)', fontsize=16, fontweight='bold')
    ax.set_ylabel('Requests per Second', fontsize=12)
    ax.set_xlabel('Day of Week', fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(days)
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # Add value labels on bars
    for bar in bars1:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 5,
                f'{int(height)}', ha='center', va='bottom', fontweight='bold')
    
    for bar in bars2:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 5,
                f'{int(height)}', ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('weekly_traffic_pattern.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_cost_breakdown_chart():
    """Create cost breakdown pie chart"""
    categories = ['GPU Compute\n(MI355X)', 'CPU Compute', 'Storage', 'Network', 'Monitoring', 'Support']
    costs = [32000, 8000, 3000, 2000, 3000, 2000]
    colors = ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777']
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    wedges, texts, autotexts = ax.pie(costs, labels=categories, autopct='%1.1f%%', 
                                      colors=colors, startangle=90)
    
    ax.set_title('Monthly Cost Breakdown ($50,000 total)', fontsize=16, fontweight='bold')
    
    # Add cost values to labels
    for i, (wedge, cost) in enumerate(zip(wedges, costs)):
        angle = (wedge.theta2 - wedge.theta1) / 2 + wedge.theta1
        x = 0.8 * np.cos(np.radians(angle))
        y = 0.8 * np.sin(np.radians(angle))
        ax.text(x, y, f'${cost:,}', ha='center', va='center', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('cost_breakdown.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_response_time_chart():
    """Create response time distribution chart"""
    percentiles = ['P50', 'P75', 'P90', 'P95', 'P99', 'P99.9']
    times = [0.8, 1.1, 1.3, 1.6, 2.2, 2.8]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    bars = ax.bar(percentiles, times, color='#2563eb', alpha=0.8)
    ax.set_title('Response Time Distribution', fontsize=16, fontweight='bold')
    ax.set_ylabel('Response Time (seconds)', fontsize=12)
    ax.set_xlabel('Percentile', fontsize=12)
    ax.grid(True, alpha=0.3)
    
    # Add value labels on bars
    for bar, time in zip(bars, times):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.05,
                f'{time}s', ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('response_time_distribution.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_growth_trend_chart():
    """Create monthly growth trend chart"""
    weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
    avg_rps = [80, 92, 105, 118, 132]
    costs = [42000, 44000, 46000, 48000, 50000]
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    
    # Traffic growth
    ax1.plot(weeks, avg_rps, 'o-', linewidth=2, markersize=8, color='#2563eb')
    ax1.fill_between(weeks, avg_rps, alpha=0.3, color='#2563eb')
    ax1.set_title('Monthly Traffic Growth (30 Days)', fontsize=16, fontweight='bold')
    ax1.set_ylabel('Average Daily RPS', fontsize=12)
    ax1.grid(True, alpha=0.3)
    
    # Add growth rate labels
    for i, (week, rps) in enumerate(zip(weeks, avg_rps)):
        if i > 0:
            growth = ((rps - avg_rps[i-1]) / avg_rps[i-1]) * 100
            ax1.annotate(f'+{growth:.0f}%', (i, rps), textcoords="offset points", 
                        xytext=(0,10), ha='center', fontweight='bold')
    
    # Cost trend
    ax2.plot(weeks, costs, 'o-', linewidth=2, markersize=8, color='#dc2626')
    ax2.fill_between(weeks, costs, alpha=0.3, color='#dc2626')
    ax2.set_title('Monthly Cost Trend', fontsize=16, fontweight='bold')
    ax2.set_ylabel('Monthly Cost ($)', fontsize=12)
    ax2.set_xlabel('Week', fontsize=12)
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('monthly_growth_trend.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_cost_per_request_chart():
    """Create cost per request type chart"""
    request_types = ['Chat', 'Model\nInference', 'Blueprint\nExecution', 'Training', 'Inference\n(Heavy)']
    costs = [0.08, 0.12, 0.15, 0.45, 0.25]
    colors = ['#059669', '#2563eb', '#d97706', '#dc2626', '#7c3aed']
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    bars = ax.bar(request_types, costs, color=colors, alpha=0.8)
    ax.set_title('Cost per Request Type', fontsize=16, fontweight='bold')
    ax.set_ylabel('Cost (cents)', fontsize=12)
    ax.set_xlabel('Request Type', fontsize=12)
    ax.grid(True, alpha=0.3)
    
    # Add value labels on bars
    for bar, cost in zip(bars, costs):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                f'{cost:.2f}¢', ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('cost_per_request.png', dpi=300, bbox_inches='tight')
    plt.close()

def create_auto_scaling_chart():
    """Create auto-scaling response chart"""
    hours = list(range(24))
    replicas = [3, 3, 3, 3, 3, 4, 8, 12, 16, 18, 17, 14, 11, 9, 7, 6, 5, 4, 4, 3, 3, 3, 3, 3]
    
    fig, ax = plt.subplots(figsize=(12, 6))
    
    ax.plot(hours, replicas, 'o-', linewidth=3, markersize=8, color='#059669')
    ax.fill_between(hours, replicas, alpha=0.3, color='#059669')
    ax.set_title('Auto-scaling Response', fontsize=16, fontweight='bold')
    ax.set_ylabel('Backend Replicas', fontsize=12)
    ax.set_xlabel('Hour of Day', fontsize=12)
    ax.grid(True, alpha=0.3)
    ax.set_xticks(hours[::2])
    
    # Add replica count labels
    for hour, replica in zip(hours, replicas):
        ax.annotate(str(replica), (hour, replica), textcoords="offset points", 
                   xytext=(0,10), ha='center', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('auto_scaling_response.png', dpi=300, bbox_inches='tight')
    plt.close()

def main():
    """Generate all charts"""
    print("Generating infrastructure performance charts...")
    
    create_hourly_traffic_chart()
    print("✓ Hourly traffic pattern chart saved as 'hourly_traffic_pattern.png'")
    
    create_weekly_traffic_chart()
    print("✓ Weekly traffic pattern chart saved as 'weekly_traffic_pattern.png'")
    
    create_cost_breakdown_chart()
    print("✓ Cost breakdown chart saved as 'cost_breakdown.png'")
    
    create_response_time_chart()
    print("✓ Response time distribution chart saved as 'response_time_distribution.png'")
    
    create_growth_trend_chart()
    print("✓ Monthly growth trend chart saved as 'monthly_growth_trend.png'")
    
    create_cost_per_request_chart()
    print("✓ Cost per request chart saved as 'cost_per_request.png'")
    
    create_auto_scaling_chart()
    print("✓ Auto-scaling response chart saved as 'auto_scaling_response.png'")
    
    print("\nAll charts generated successfully!")
    print("Files created:")
    print("- hourly_traffic_pattern.png")
    print("- weekly_traffic_pattern.png") 
    print("- cost_breakdown.png")
    print("- response_time_distribution.png")
    print("- monthly_growth_trend.png")
    print("- cost_per_request.png")
    print("- auto_scaling_response.png")

if __name__ == "__main__":
    main() 