"""
Test script for document expiry scanning
Run this to test the document scanner API
"""
import requests
import sys

def test_scan_document(image_path):
    """
    Test the document scanning endpoint
    """
    url = "http://localhost:8000/api/scan-document"
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            data = {'document_type': 'test'}
            
            print(f"📄 Uploading: {image_path}")
            print("⏳ Scanning document...")
            
            response = requests.post(url, files=files, data=data)
            result = response.json()
            
            print("\n" + "="*50)
            if result.get('success'):
                print("✅ SUCCESS!")
                print(f"📅 Expiry Date: {result.get('formatted_date')}")
                print(f"⏱️  Days Until Expiry: {result.get('days_until_expiry')} days")
                print(f"⚠️  Urgency: {result.get('urgency').upper()}")
                print(f"💬 Message: {result.get('message')}")
                
                if result.get('should_create_reminder'):
                    print("\n🔔 Reminder should be created!")
                    
                if result.get('urgency') == 'expired':
                    print("\n🚨 WARNING: This document is EXPIRED!")
                elif result.get('urgency') == 'high':
                    print("\n⚠️  WARNING: This document expires soon!")
            else:
                print("❌ FAILED")
                print(f"Error: {result.get('error')}")
                print(f"Message: {result.get('message')}")
            
            print("="*50)
            return result
    
    except FileNotFoundError:
        print(f"❌ Error: File not found: {image_path}")
        return None
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to backend server")
        print("Make sure the server is running: python main.py")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_document_scan.py <image_path>")
        print("\nExample:")
        print("  python test_document_scan.py passport.jpg")
        print("  python test_document_scan.py insurance.png")
        sys.exit(1)
    
    image_path = sys.argv[1]
    test_scan_document(image_path)

